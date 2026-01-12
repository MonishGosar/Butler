import fs from 'fs';
import path from 'path';
import os from 'os';
import { SearchResult, ClipboardItem } from '../shared/types';

interface IndexedApp {
    name: string;
    path: string;
}

interface IndexedFile {
    name: string;
    path: string;
    type: 'file' | 'folder';
}

export class SearchEngine {
    private indexedApps: IndexedApp[] = [];
    private indexedFiles: IndexedFile[] = [];

    constructor() { }

    public async initialize() {
        await this.indexApplications();
        await this.indexCommonFiles();
    }

    public search(query: string, clipboardHistory: ClipboardItem[] = []): SearchResult[] {
        if (!query.trim()) {
            return [];
        }

        const lowerQuery = query.toLowerCase().trim();
        const results: SearchResult[] = [];

        // Search applications
        results.push(...this.searchApplications(lowerQuery));

        // Search files
        results.push(...this.searchFiles(lowerQuery));

        // Search clipboard
        results.push(...this.searchClipboard(lowerQuery, clipboardHistory));

        return results.slice(0, 8);
    }

    private searchApplications(query: string): SearchResult[] {
        return this.indexedApps
            .filter(app => {
                const lowerName = app.name.toLowerCase();
                return lowerName.includes(query) ||
                    lowerName.split(/[\s\-_]/).some(word => word.startsWith(query));
            })
            .sort((a, b) => {
                const aStarts = a.name.toLowerCase().startsWith(query) ? 0 : 1;
                const bStarts = b.name.toLowerCase().startsWith(query) ? 0 : 1;
                return aStarts - bStarts || a.name.localeCompare(b.name);
            })
            .slice(0, 5)
            .map(app => ({
                id: `app-${app.name}`,
                title: app.name,
                subtitle: 'Application',
                type: 'app' as const,
                path: app.path,
            }));
    }

    private searchFiles(query: string): SearchResult[] {
        return this.indexedFiles
            .filter(file => file.name.toLowerCase().includes(query))
            .sort((a, b) => {
                const aStarts = a.name.toLowerCase().startsWith(query) ? 0 : 1;
                const bStarts = b.name.toLowerCase().startsWith(query) ? 0 : 1;
                return aStarts - bStarts || a.name.localeCompare(b.name);
            })
            .slice(0, 3)
            .map(file => ({
                id: `file-${file.path}`,
                title: file.name,
                subtitle: file.type === 'folder' ? 'Folder' : 'File',
                type: 'file' as const,
                path: file.path,
            }));
    }

    private searchClipboard(query: string, history: ClipboardItem[]): SearchResult[] {
        return history
            .filter(item => item.content.toLowerCase().includes(query))
            .slice(0, 2)
            .map(item => ({
                id: `clipboard-${item.id}`,
                title: item.content.substring(0, 60) + (item.content.length > 60 ? '...' : ''),
                subtitle: 'Clipboard',
                type: 'clipboard' as const,
                path: item.content,
            }));
    }

    private async indexApplications(): Promise<void> {
        const apps: IndexedApp[] = [];

        // Windows Start Menu locations
        const startMenuPaths = [
            path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
            'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs',
            path.join(os.homedir(), 'Desktop'),
        ];

        // Common system executables
        const systemApps = [
            { name: 'Notepad', path: 'notepad.exe' },
            { name: 'Calculator', path: 'calc.exe' },
            { name: 'Command Prompt', path: 'cmd.exe' },
            { name: 'PowerShell', path: 'powershell.exe' },
            { name: 'Task Manager', path: 'taskmgr.exe' },
            { name: 'File Explorer', path: 'explorer.exe' },
            { name: 'Settings', path: 'ms-settings:' },
            { name: 'Control Panel', path: 'control.exe' },
        ];

        apps.push(...systemApps);

        for (const menuPath of startMenuPaths) {
            try {
                if (fs.existsSync(menuPath)) {
                    await this.scanDirectory(menuPath, apps);
                }
            } catch (error) {
                console.log(`Could not scan ${menuPath}:`, error);
            }
        }

        this.indexedApps = apps;
    }

    private async scanDirectory(dirPath: string, apps: IndexedApp[], depth = 0): Promise<void> {
        if (depth > 3) return;

        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                    await this.scanDirectory(fullPath, apps, depth + 1);
                } else if (entry.name.endsWith('.lnk') || entry.name.endsWith('.exe')) {
                    const appName = entry.name.replace(/\.(lnk|exe)$/i, '');
                    const lowerName = appName.toLowerCase();

                    if (!lowerName.includes('uninstall') &&
                        !lowerName.includes('readme') &&
                        !lowerName.includes('help')) {
                        if (!apps.some(a => a.name.toLowerCase() === appName.toLowerCase())) {
                            apps.push({
                                name: appName,
                                path: fullPath,
                            });
                        }
                    }
                }
            }
        } catch (error) {
            // Ignore errors
        }
    }

    private async indexCommonFiles(): Promise<void> {
        const files: IndexedFile[] = [];
        const commonPaths = [
            path.join(os.homedir(), 'Desktop'),
            path.join(os.homedir(), 'Documents'),
            path.join(os.homedir(), 'Downloads'),
        ];

        for (const dirPath of commonPaths) {
            try {
                if (fs.existsSync(dirPath)) {
                    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

                    for (const entry of entries) {
                        if (entry.name.startsWith('.')) continue;

                        files.push({
                            name: entry.name,
                            path: path.join(dirPath, entry.name),
                            type: entry.isDirectory() ? 'folder' : 'file',
                        });
                    }
                }
            } catch (error) {
                // Ignore errors
            }
        }

        this.indexedFiles = files;
    }
}
