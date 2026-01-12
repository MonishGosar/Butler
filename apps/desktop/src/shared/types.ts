export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  type: 'app' | 'file' | 'command' | 'clipboard';
  path?: string;
}

export interface ClipboardItem {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: number;
}

export interface AppConfig {
  shortcuts: {
    launcher: string;
    clipboard: string;
  };
  ui: {
    theme: 'dark' | 'light';
    maxResults: number;
  };
}