import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ClipboardItem } from '../shared/types';
import './Clipboard.css';

// Clipboard Icon SVG
const ClipboardIcon = () => (
  <svg className="clipboard-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return new Date(timestamp).toLocaleDateString();
};

const ClipboardView: React.FC = () => {
  const [clipboardHistory, setClipboardHistory] = useState<ClipboardItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState('');
  const [currentClipboard, setCurrentClipboard] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);

  // Load clipboard history
  const loadClipboardHistory = useCallback(async () => {
    if (!window.electronAPI?.getClipboardHistory) {
      // Mock data for browser testing
      const mockHistory: ClipboardItem[] = [
        { id: '1', content: 'const example = "Hello World";', type: 'text', timestamp: Date.now() - 60000 },
        { id: '2', content: 'https://github.com/example/repo', type: 'text', timestamp: Date.now() - 300000 },
        { id: '3', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', type: 'text', timestamp: Date.now() - 600000 },
        { id: '4', content: 'npm install react typescript', type: 'text', timestamp: Date.now() - 3600000 },
      ];
      setClipboardHistory(mockHistory);
      setCurrentClipboard(mockHistory[0]?.content || '');
      return;
    }

    const history = await window.electronAPI.getClipboardHistory();
    setClipboardHistory(history);
    if (history.length > 0) {
      setCurrentClipboard(history[0].content);
    }
  }, []);

  useEffect(() => {
    loadClipboardHistory();

    const handleShowWindow = () => {
      loadClipboardHistory();
      setSelectedIndex(0);
      setFilter('');
      setTimeout(() => {
        filterInputRef.current?.focus();
      }, 100);
    };

    window.electronAPI?.onShowWindow?.(handleShowWindow);

    // Focus container for keyboard events
    containerRef.current?.focus();
  }, [loadClipboardHistory]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!filter.trim()) return clipboardHistory;
    const lowerFilter = filter.toLowerCase();
    return clipboardHistory.filter(item =>
      item.content.toLowerCase().includes(lowerFilter)
    );
  }, [clipboardHistory, filter]);

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filter]);

  const handleItemClick = useCallback((item: ClipboardItem) => {
    if (window.electronAPI) {
      window.electronAPI.addToClipboard(item.content);
      window.electronAPI.hideWindow();
    } else {
      console.log('Copy to clipboard:', item.content);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
          handleItemClick(filteredItems[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (filter) {
          setFilter('');
        } else {
          window.electronAPI?.hideWindow();
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          setSelectedIndex(prev => prev > 0 ? prev - 1 : filteredItems.length - 1);
        } else {
          setSelectedIndex(prev => prev < filteredItems.length - 1 ? prev + 1 : 0);
        }
        break;
    }
  }, [filteredItems, selectedIndex, filter, handleItemClick]);

  return (
    <div
      className="clipboard-container"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="clipboard-header">
        <h3>
          <ClipboardIcon />
          Clipboard History
        </h3>
        <span className="clipboard-count">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search Filter */}
      <div className="clipboard-search">
        <input
          ref={filterInputRef}
          type="text"
          className="clipboard-search-input"
          placeholder="Filter clipboard history..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              handleKeyDown(e);
            }
          }}
        />
      </div>

      {/* Items List */}
      <div className="clipboard-items">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className={`clipboard-item ${index === selectedIndex ? 'selected' : ''} ${item.content === currentClipboard ? 'current' : ''}`}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="clipboard-content">
              {item.content.length > 150
                ? item.content.substring(0, 150) + '...'
                : item.content
              }
            </div>
            <div className="clipboard-meta">
              <span className="clipboard-timestamp">
                {formatTimeAgo(item.timestamp)}
              </span>
              <span className="clipboard-length">
                {item.content.length} chars
              </span>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && filter && (
          <div className="clipboard-empty">
            <div className="clipboard-empty-title">No matches found</div>
            <div className="clipboard-empty-subtitle">Try a different filter</div>
          </div>
        )}

        {clipboardHistory.length === 0 && (
          <div className="clipboard-empty">
            <EmptyIcon />
            <div className="clipboard-empty-title">No clipboard history</div>
            <div className="clipboard-empty-subtitle">
              Items you copy will appear here
            </div>
          </div>
        )}
      </div>

      {/* Footer Hints */}
      {filteredItems.length > 0 && (
        <div className="clipboard-footer">
          <span className="clipboard-hint">
            <kbd>↑</kbd><kbd>↓</kbd> navigate
          </span>
          <span className="clipboard-hint">
            <kbd>↵</kbd> paste
          </span>
          <span className="clipboard-hint">
            <kbd>esc</kbd> close
          </span>
        </div>
      )}
    </div>
  );
};

export default ClipboardView;