import { contextBridge, ipcRenderer } from 'electron';

export const electronAPI = {
  // Window management
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  showWindow: () => ipcRenderer.invoke('show-window'),
  resizeWindow: (height: number) => ipcRenderer.invoke('resize-window', height),

  // Search functionality
  search: (query: string) => ipcRenderer.invoke('search', query),

  // Execute action (launch app or open file)
  executeAction: (actionData: { type: string; path: string }) =>
    ipcRenderer.invoke('execute-action', actionData),

  // Clipboard functionality
  getClipboardHistory: () => ipcRenderer.invoke('get-clipboard-history'),
  addToClipboard: (content: string) => ipcRenderer.invoke('add-to-clipboard', content),

  // App management
  quitApp: () => ipcRenderer.invoke('quit-app'),

  // Get native file icon
  getFileIcon: (filePath: string): Promise<string | null> =>
    ipcRenderer.invoke('get-file-icon', filePath),

  // Events
  onShowWindow: (callback: () => void) => {
    ipcRenderer.on('show-window', callback);
    ipcRenderer.on('focus-input', callback);
  },
  onHideWindow: (callback: () => void) => {
    ipcRenderer.on('hide-window', callback);
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}