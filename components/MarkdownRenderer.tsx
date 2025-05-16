// components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import remarkWikiLink from "remark-wiki-link";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// 코드 하이라이팅 언어 등록 (변경 없음)
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import markdownLang from "react-syntax-highlighter/dist/esm/languages/prism/markdown";

SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);
SyntaxHighlighter.registerLanguage("markdown", markdownLang);
SyntaxHighlighter.registerLanguage("md", markdownLang);
// --- 언어 등록 끝 ---

interface MarkdownRendererProps {
  markdownContent: string;
  wikiLinkOptions: any;
  onLinkClick?: (targetNoteId: string) => void; // 타입 변경됨
}

interface CustomCodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdownContent,
  wikiLinkOptions,
  onLinkClick, // 이제 (targetNoteId: string) => void 타입의 함수
}) => {
  const customMarkdownComponents: Components = {
    code({ node, inline, className, children, ...props }: CustomCodeProps) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match && match[1] ? match[1] : "text";

      if (!inline) {
        return (
          <SyntaxHighlighter
            style={materialDark}
            language={language}
            PreTag="pre"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      } else {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
    },
    a: ({ node, children, href, ...props }) => {
      if (href && href.startsWith("/?note=")) {
        const targetNoteId = href.substring("/?note=".length);
        const { className: anchorClassName, ...restProps } = props;
        return (
          <Link
            href={href}
            {...restProps}
            className={`internal-link ${anchorClassName || ""}`}
            onClick={() => {
              // onClick 핸들러 수정
              if (onLinkClick) {
                onLinkClick(targetNoteId); // 추출한 targetNoteId를 콜백으로 전달
              }
            }}
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  if (!markdownContent) {
    return (
      <p className="text-[var(--foreground-muted)] transition-colors duration-150 ease-in-out">
        Content is empty or not available.
      </p>
    );
  }

  return (
    <div className="prose dark:prose-invert max-w-4xl">
      {" "}
      {/* MarkdownRenderer 내부의 max-width는 유지, HomePageClient에서 최종 너비 제어 */}
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkBreaks,
          [remarkWikiLink, wikiLinkOptions],
        ]}
        rehypePlugins={[rehypeRaw]}
        components={customMarkdownComponents}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
