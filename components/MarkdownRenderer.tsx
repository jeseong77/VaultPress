// components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw"; // rehypeRaw 사용 시 XSS 공격에 주의 (신뢰할 수 있는 콘텐츠에만 사용)
import remarkWikiLink from "remark-wiki-link";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  ghcolors,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// 코드 하이라이팅 언어 등록 (기존과 동일)
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
  onLinkClick?: (targetNoteId: string) => void;
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
  onLinkClick,
}) => {
  const customMarkdownComponents: Components = {
    code({ node, inline, className, children, ...props }: CustomCodeProps) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match && match[1] ? match[1] : "text";
      const content = String(children);

      // 휴리스틱을 사용하여 인라인 코드인지 블록 코드인지 결정
      // 1. 인라인 코드: inline prop이 true이거나
      // 2. 블록 코드: content 길이가 80자 미만이고 줄바꿈이 없는 경우
      const effectivelyInline =
        inline || (content.length < 80 && !content.includes("\n"));

      if (!effectivelyInline) {
        return (
          <SyntaxHighlighter
            style={ghcolors}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: 4,
              backgroundColor: "transparent",
              borderRadius: 4,
              overflow: "auto",
            }}
            {...props}
            codeTagProps={{
              style: { backgroundColor: "transparent" },
            }}
          >
            {content.replace(/\n$/, "")}
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
    // 링크 컴포넌트
    a: ({ node, children, href, ...props }) => {
      if (href && href.startsWith("/?note=")) {
        const targetNoteId = href.substring("/?note=".length);
        const { className: anchorClassName, ...restProps } = props;
        return (
          <Link
            href={href}
            {...restProps}
            className={`internal-link ${anchorClassName || ""}`.trim()}
            onClick={(e) => {
              if (onLinkClick) {
                onLinkClick(targetNoteId);
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

  // 마크다운 콘텐츠가 비어있거나 null인 경우
  if (!markdownContent) {
    return (
      <p className="text-[var(--foreground-muted)] transition-colors duration-150 ease-in-out">
        Content is empty or not available.
      </p>
    );
  }

  // ReactMarkdown을 사용하여 마크다운 콘텐츠를 렌더링
  return (
    <div className="prose dark:prose-invert max-w-4xl">
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
