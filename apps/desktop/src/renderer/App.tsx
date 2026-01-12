import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'app' | 'file' | 'command' | 'clipboard';
  path?: string;
}

// Simple SVG fallback icons
const FallbackIcons = {
  search: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  ),
  app: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm9 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm9 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
};

// Icon cache to avoid re-fetching
const iconCache = new Map<string, string | null>();

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// Result Icon component with native icon loading
const ResultIcon: React.FC<{ type: string; path?: string }> = ({ type, path }) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!path || type === 'clipboard') {
      setLoaded(true);
      return;
    }

    // Check cache first
    const cached = iconCache.get(path);
    if (cached !== undefined) {
      setIconUrl(cached);
      setLoaded(true);
      return;
    }

    // Fetch icon from main process
    const fetchIcon = async () => {
      try {
        if (window.electronAPI?.getFileIcon) {
          const icon = await window.electronAPI.getFileIcon(path);
          iconCache.set(path, icon);
          setIconUrl(icon);
        }
      } catch (e) {
        iconCache.set(path, null);
      }
      setLoaded(true);
    };

    fetchIcon();
  }, [path, type]);

  // Show native icon if available
  if (iconUrl && loaded) {
    return (
      <div className="result-icon">
        <img src={iconUrl} alt="" />
      </div>
    );
  }

  // Fallback to SVG icons
  const getFallbackIcon = () => {
    if (path?.startsWith('ms-settings:')) return FallbackIcons.settings;
    switch (type) {
      case 'app': return FallbackIcons.app;
      case 'file': return FallbackIcons.file;
      case 'folder': return FallbackIcons.folder;
      case 'clipboard': return FallbackIcons.clipboard;
      default: return FallbackIcons.app;
    }
  };

  return (
    <div className={`result-icon fallback`}>
      {getFallbackIcon()}
    </div>
  );
};

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 100);

  // Focus input on mount and when window shows
  useEffect(() => {
    inputRef.current?.focus();
    window.electronAPI?.onShowWindow?.(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, []);

  // Resize window based on content
  useEffect(() => {
    const itemHeight = 48;
    const searchHeight = 56; // Match the CSS padding
    const maxItems = 8;
    const borderPadding = 8; // Extra padding for borders

    const visibleItems = Math.min(results.length, maxItems);
    let height = searchHeight;

    if (visibleItems > 0) {
      height += (visibleItems * itemHeight) + borderPadding;
    } else if (query.trim()) {
      // Empty state height
      height += 80;
    }

    window.electronAPI?.resizeWindow?.(height);
  }, [results.length, query]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }


    if (!window.electronAPI?.search) {
      // Mock for browser testing
      const mock = [
        { id: '1', title: 'Notepad', subtitle: 'App', type: 'app' as const, path: 'notepad.exe' },
        { id: '2', title: 'Calculator', subtitle: 'App', type: 'app' as const, path: 'calc.exe' },
        { id: '3', title: 'Settings', subtitle: 'App', type: 'app' as const, path: 'ms-settings:' },
        { id: '4', title: 'PowerShell', subtitle: 'App', type: 'app' as const, path: 'powershell.exe' },
        { id: '5', title: 'Command Prompt', subtitle: 'App', type: 'app' as const, path: 'cmd.exe' },
        { id: '6', title: 'File Explorer', subtitle: 'App', type: 'app' as const, path: 'explorer.exe' },
        { id: '7', title: 'Task Manager', subtitle: 'App', type: 'app' as const, path: 'taskmgr.exe' },
      ].filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
      setResults(mock);
      setSelectedIndex(0);
      return;
    }

    try {
      const searchResults = await window.electronAPI.search(searchQuery);
      setResults(searchResults);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  }, []);

  // Search on query change
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Execute action
  const executeAction = useCallback((result: SearchResult) => {
    if (!window.electronAPI) {
      console.log('Action:', result.title);
      return;
    }

    if (result.type === 'clipboard') {
      window.electronAPI.addToClipboard(result.path || result.title);
    } else {
      window.electronAPI.executeAction({
        type: result.type,
        path: result.path || '',
      });
    }

    setQuery('');
    setResults([]);
    window.electronAPI.hideWindow();
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) executeAction(results[selectedIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        setQuery('');
        setResults([]);
        window.electronAPI?.hideWindow();
        break;
      case 'Tab':
        e.preventDefault();
        setSelectedIndex(i => (i + (e.shiftKey ? -1 : 1) + results.length) % results.length);
        break;
    }
  };

  return (
    <div className="launcher">
      <div className="search-box">
        <span className="search-icon">{FallbackIcons.search}</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type to search..."
          className="search-input"
          autoFocus
          spellCheck={false}
        />
      </div>

      {results.length > 0 && (
        <div className="results">
          {results.map((result, i) => (
            <div
              key={result.id}
              className={`result-item ${i === selectedIndex ? 'selected' : ''}`}
              onClick={() => executeAction(result)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <ResultIcon type={result.type} path={result.path} />
              <div className="result-content">
                <div className="result-title">{result.title}</div>
                {result.subtitle && (
                  <div className="result-subtitle">{result.subtitle}</div>
                )}
              </div>
              <span className="result-hint">↵</span>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="empty-state">No results found</div>
      )}
    </div>
  );
};

export default App;