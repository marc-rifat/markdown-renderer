import { useState, useEffect, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import './App.css';

const STORAGE_KEY = 'markdown-content';

const DEFAULT_MARKDOWN = `# Welcome to Markdown Renderer

A beautiful way to preview your Markdown files with **syntax highlighting** and *live preview*.

## Features

- **File Upload**: Drag and drop or browse for .md files
- **Live Editor**: Write and preview markdown in real-time
- **Theme Toggle**: Switch between light and dark modes
- **Auto-save**: Your content persists across page refreshes

## Code Example

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

## Table Example

| Feature | Description | Status |
|---------|-------------|--------|
| GFM Support | GitHub Flavored Markdown | Active |
| Syntax Highlighting | Code block highlighting | Active |
| Dark Mode | Theme toggle support | Active |

## Task List

- [x] Setup project
- [x] Add markdown parsing
- [x] Style with Apple design
- [x] Auto-save content

## Blockquote

> Markdown is a lightweight markup language with plain-text formatting syntax.
> It was created by John Gruber in 2004.

---

Start by uploading a file or editing directly in the editor panel.
`;

/**
 * Retrieves stored markdown content from localStorage.
 * @returns Stored markdown or default content if none exists.
 */
function getStoredMarkdown(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ?? DEFAULT_MARKDOWN;
}

/**
 * Main application component that orchestrates the markdown renderer.
 * Manages theme state and markdown content across child components.
 * Content is persisted to localStorage automatically.
 * @returns The complete application with header, input panel, and preview.
 */
function App() {
  const [theme, toggleTheme] = useTheme();
  const [markdown, setMarkdown] = useState(getStoredMarkdown);

  /**
   * Saves markdown content to localStorage whenever it changes.
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, markdown);
  }, [markdown]);

  /**
   * Handles markdown content changes from child components.
   */
  const handleMarkdownChange = useCallback((content: string) => {
    setMarkdown(content);
  }, []);

  return (
    <div className="app">
      <Header theme={theme} onThemeToggle={toggleTheme} />
      <main className="main-content">
        <div className="panels-container">
          <div className="panel input-panel-wrapper">
            <InputPanel markdown={markdown} onMarkdownChange={handleMarkdownChange} />
          </div>
          <div className="panel preview-panel">
            <div className="preview-header">
              <span className="preview-title">Preview</span>
            </div>
            <div className="preview-content">
              <MarkdownRenderer content={markdown} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
