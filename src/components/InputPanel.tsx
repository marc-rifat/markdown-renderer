import { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import './InputPanel.css';

type InputMode = 'upload' | 'editor';

interface InputPanelProps {
  markdown: string;
  onMarkdownChange: (content: string) => void;
}

/**
 * Panel for inputting markdown via file upload or live editor.
 * Supports drag-and-drop file uploads.
 * @param props - Component props for markdown state and change handler.
 * @returns Input panel with tabs for different input modes.
 */
export function InputPanel({ markdown, onMarkdownChange }: InputPanelProps) {
  const [mode, setMode] = useState<InputMode>('upload');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles file selection from input or drag-and-drop.
   * @param file - The markdown file to read.
   */
  const handleFile = (file: File) => {
    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      setError('Please select a Markdown file (.md or .markdown)');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onMarkdownChange(content);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  /**
   * Handles file input change event.
   * @param e - Change event from file input.
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  /**
   * Handles drag over event for drop zone.
   * @param e - Drag event.
   */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handles drag leave event for drop zone.
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Handles file drop event.
   * @param e - Drag event with dropped files.
   */
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="input-panel">
      <div className="input-tabs">
        <button
          className={`input-tab ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => setMode('upload')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload
        </button>
        <button
          className={`input-tab ${mode === 'editor' ? 'active' : ''}`}
          onClick={() => setMode('editor')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editor
        </button>
      </div>

      <div className="input-content">
        {mode === 'upload' && (
          <div
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown"
              onChange={handleFileChange}
              className="file-input"
            />
            <div className="drop-zone-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="drop-zone-text">
                Drag and drop a Markdown file here, or click to browse
              </p>
              <span className="drop-zone-hint">.md or .markdown files</span>
            </div>
          </div>
        )}

        {mode === 'editor' && (
          <div className="editor-container">
            <div className="editor-toolbar">
              <button
                className="clear-button"
                onClick={() => onMarkdownChange('')}
                disabled={!markdown}
                title="Clear content"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Clear
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => onMarkdownChange(e.target.value)}
              placeholder="Type or paste your Markdown here..."
              className="markdown-editor"
              spellCheck={false}
            />
          </div>
        )}

        {error && (
          <div className="error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
