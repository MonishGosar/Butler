import { app, BrowserWindow, globalShortcut, ipcMain, clipboard, shell, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { SearchResult, ClipboardItem } from '../shared/types';
import { SearchEngine } from './search-engine';

class LauncherApp {
  private mainWindow: BrowserWindow | null = null;
  private clipboardWindow: BrowserWindow | null = null;
  private tray: Tray | null = null;
  private clipboardHistory: ClipboardItem[] = [];
  private isDev = process.env.NODE_ENV === 'development';
  private searchEngine: SearchEngine;

  constructor() {
    this.searchEngine = new SearchEngine();
    this.initializeApp();
  }

  private initializeApp() {
    app.whenReady().then(async () => {
      this.createWindows();
      this.createTray();
      this.setupClipboardMonitoring();
      this.setupIpcHandlers();

      // Initialize search engine
      await this.searchEngine.initialize();

      // Show main window initially so user knows it's working
      this.mainWindow?.show();

      // Register shortcuts with retries
      this.registerGlobalShortcutsWithRetry();
    });

    app.on('window-all-closed', () => {
      // Keep app running in background
    });

    app.on('will-quit', () => {
      globalShortcut.unregisterAll();
    });

    app.on('browser-window-focus', () => {
      if (!globalShortcut.isRegistered('CommandOrControl+Space') &&
        !globalShortcut.isRegistered('Ctrl+Space') &&
        !globalShortcut.isRegistered('Alt+Space')) {
        setTimeout(() => {
          this.registerGlobalShortcuts();
        }, 500);
      }
    });
  }

  private createTray() {
    const iconPath = path.join(__dirname, '../../assets/icon.ico'); // Ideally exists
    // Use an empty image if we don't have one, but Tray needs SOMETHING.
    // For now we assume no icon might show a default or empty space.
    // In a real app we'd ship an icon.
    this.tray = new Tray(nativeImage.createEmpty());
    this.tray.setToolTip('Windows Launcher (Dev)');
    this.tray.setTitle('WL'); // Shows text on macOS, ignored on Windows usually? No, Windows needs icon.

    // Attempt to create a simple icon from data URL (red dot)
    try {
      const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKwAEQAAAABJRU5ErkJggg==');
      this.tray.setImage(icon);
    } catch (e) {
      console.error('Failed to set tray icon', e);
    }

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show Launcher', click: () => this.toggleMainWindow() },
      { label: 'Show Clipboard', click: () => this.toggleClipboardWindow() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() }
    ]);

    this.tray.setContextMenu(contextMenu);

    this.tray.on('click', () => {
      this.toggleMainWindow();
    });
  }

  private createWindows() {
    app.commandLine.appendSwitch('disable-gpu');
    app.commandLine.appendSwitch('disable-software-rasterizer');

    // Main launcher window - Spotlight-style dimensions
    this.mainWindow = new BrowserWindow({
      width: 600,
      height: 56,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
        devTools: true,
      },
    });

    // Handle F12 manually to open detached DevTools (prevents ghost window issues)
    this.mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12' && input.type === 'keyDown') {
        event.preventDefault();
        if (this.mainWindow?.webContents.isDevToolsOpened()) {
          this.mainWindow.webContents.closeDevTools();
        } else {
          this.mainWindow?.webContents.openDevTools({ mode: 'detach' });
        }
      }
    });

    // Clipboard history window
    this.clipboardWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // Load content
    if (this.isDev) {
      this.mainWindow.loadURL('http://localhost:3000');
      this.clipboardWindow.loadURL('http://localhost:3000/clipboard');
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'));
      this.clipboardWindow.loadFile(path.join(__dirname, '../../renderer/clipboard.html'));
    }

    // Center windows on screen
    this.mainWindow.center();
    this.clipboardWindow.center();

    // Hide when clicking outside (blur)
    this.mainWindow.on('blur', () => {
      // Small delay to allow for app launching
      setTimeout(() => {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
          this.mainWindow.hide();
        }
      }, 100);
    });

    if (this.isDev) {
      this.mainWindow.show();
    }
  }

  private registerGlobalShortcuts() {
    try {
      globalShortcut.unregisterAll();

      let launcherRegistered = false;
      let clipboardRegistered = false;

      // Try multiple shortcuts in order - F1 as fallback since Ctrl+Space often conflicts
      const launcherShortcuts = ['Alt+Space', 'Ctrl+Space', 'F1'];
      const clipboardShortcuts = ['Alt+V', 'Ctrl+Shift+V', 'F2'];

      for (const shortcut of launcherShortcuts) {
        launcherRegistered = globalShortcut.register(shortcut, () => {
          this.toggleMainWindow();
        });
        if (launcherRegistered) {
          console.log(`Launcher shortcut registered: ${shortcut} `);
          break;
        }
      }

      for (const shortcut of clipboardShortcuts) {
        clipboardRegistered = globalShortcut.register(shortcut, () => {
          this.toggleClipboardWindow();
        });
        if (clipboardRegistered) {
          console.log(`Clipboard shortcut registered: ${shortcut} `);
          break;
        }
      }

      console.log('Shortcuts registration result:', { launcherRegistered, clipboardRegistered });

      return { launcherRegistered, clipboardRegistered };
    } catch (error) {
      console.error('Error registering shortcuts:', error);
      return { launcherRegistered: false, clipboardRegistered: false };
    }
  }

  private registerGlobalShortcutsWithRetry() {
    let attempts = 0;
    const maxAttempts = 3;

    const tryRegister = () => {
      attempts++;
      const result = this.registerGlobalShortcuts();

      if ((!result.launcherRegistered || !result.clipboardRegistered) && attempts < maxAttempts) {
        console.log(`Retrying shortcut registration(${attempts} / ${maxAttempts})...`);
        setTimeout(tryRegister, 2000);
      }
    };

    tryRegister();
  }

  private setupClipboardMonitoring() {
    let lastClipboard = clipboard.readText();

    setInterval(() => {
      const currentClipboard = clipboard.readText();
      if (currentClipboard !== lastClipboard && currentClipboard.trim()) {
        this.addToClipboardHistory(currentClipboard);
        lastClipboard = currentClipboard;
      }
    }, 1000);
  }

  private addToClipboardHistory(content: string) {
    const item: ClipboardItem = {
      id: Date.now().toString(),
      content,
      type: 'text',
      timestamp: Date.now(),
    };

    this.clipboardHistory.unshift(item);

    if (this.clipboardHistory.length > 50) {
      this.clipboardHistory = this.clipboardHistory.slice(0, 50);
    }
  }

  private setupIpcHandlers() {
    // Window management
    ipcMain.handle('hide-window', () => {
      if (this.mainWindow) {
        this.mainWindow.hide();
      }
      if (this.clipboardWindow) {
        this.clipboardWindow.hide();
      }
    });

    ipcMain.handle('show-window', () => {
      if (this.mainWindow) {
        this.mainWindow.show();
        this.mainWindow.center();
        this.mainWindow.focus();
      }
    });

    // Resize window based on results
    ipcMain.handle('resize-window', (_, height: number) => {
      if (this.mainWindow) {
        const currentBounds = this.mainWindow.getBounds();
        // Minimum 56px for search bar, max 600px total
        const newHeight = Math.max(56, Math.min(height, 600));
        this.mainWindow.setBounds({
          ...currentBounds,
          height: newHeight,
        });
        this.mainWindow.center();
      }
    });

    // Search functionality
    ipcMain.handle('search', async (_, query: string): Promise<SearchResult[]> => {
      try {
        const results = this.searchEngine.search(query, this.clipboardHistory);
        // Ensure all results are plain serializable objects
        // This fixes the "object could not be cloned" error in Electron's structured clone algorithm
        const serializableResults = JSON.parse(JSON.stringify(results));
        return serializableResults;
      } catch (error) {
        console.error('Search error:', error);
        return [];
      }
    });

    // Execute action (launch app or open file)
    ipcMain.handle('execute-action', async (_, actionData: { type: string; path: string }) => {
      try {
        if (actionData.type === 'app') {
          if (actionData.path.startsWith('ms-settings:')) {
            shell.openExternal(actionData.path);
          } else if (actionData.path.endsWith('.lnk')) {
            shell.openPath(actionData.path);
          } else {
            const { spawn } = require('child_process');
            spawn(actionData.path, [], { detached: true, stdio: 'ignore', shell: true });
          }
        } else if (actionData.type === 'file' || actionData.type === 'folder') {
          shell.openPath(actionData.path);
        }

        // Hide window after action
        this.mainWindow?.hide();
      } catch (error) {
        console.error('Error executing action:', error);
      }
    });

    // Clipboard functionality
    ipcMain.handle('get-clipboard-history', (): ClipboardItem[] => {
      return this.clipboardHistory;
    });

    ipcMain.handle('add-to-clipboard', (_, content: string) => {
      clipboard.writeText(content);
      this.addToClipboardHistory(content);
    });

    // App management
    ipcMain.handle('quit-app', () => {
      app.quit();
    });

    // Get file icon - extracts native Windows icons
    ipcMain.handle('get-file-icon', async (_, filePath: string): Promise<string | null> => {
      try {
        // Handle system apps that need icon lookup
        const systemIconPaths: Record<string, string> = {
          'notepad.exe': 'C:\\Windows\\System32\\notepad.exe',
          'calc.exe': 'C:\\Windows\\System32\\calc.exe',
          'cmd.exe': 'C:\\Windows\\System32\\cmd.exe',
          'powershell.exe': 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
          'taskmgr.exe': 'C:\\Windows\\System32\\Taskmgr.exe',
          'explorer.exe': 'C:\\Windows\\explorer.exe',
          'control.exe': 'C:\\Windows\\System32\\control.exe',
        };

        let iconPath = filePath;

        // Check if it's a simple system app name
        if (systemIconPaths[filePath.toLowerCase()]) {
          iconPath = systemIconPaths[filePath.toLowerCase()];
        }

        // Skip ms-settings: URLs
        if (filePath.startsWith('ms-settings:')) {
          return null;
        }

        const icon = await app.getFileIcon(iconPath, { size: 'large' });
        const dataUrl = icon.toDataURL();
        return dataUrl;
      } catch (error) {
        console.log('Could not get icon for:', filePath);
        return null;
      }
    });
  }

  private toggleMainWindow() {
    if (this.mainWindow) {
      if (this.mainWindow.isVisible()) {
        this.mainWindow.hide();
      } else {
        this.mainWindow.show();
        this.mainWindow.center();
        this.mainWindow.focus();
        this.mainWindow.webContents.send('focus-input');
      }
    }
  }

  private toggleClipboardWindow() {
    if (this.clipboardWindow) {
      if (this.clipboardWindow.isVisible()) {
        this.clipboardWindow.hide();
      } else {
        this.clipboardWindow.show();
        this.clipboardWindow.center();
        this.clipboardWindow.focus();
      }
    }
  }
}

// Initialize the app
new LauncherApp();