import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Renders markdown content with GitHub Flavored Markdown support,
 * syntax highlighting for code blocks, and raw HTML support.
 * @param props - Component props containing markdown content string.
 * @returns Rendered markdown as React elements.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
