"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ReactMarkdown, { type Components } from "react-markdown";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import remarkWikiLink from "remark-wiki-link";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  nord,
  solarizedlight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// --- 언어 import ---
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import markdownLang from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import java_lang from "react-syntax-highlighter/dist/esm/languages/prism/java";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import dart from "react-syntax-highlighter/dist/esm/languages/prism/dart";
import c from "react-syntax-highlighter/dist/esm/languages/prism/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import csharp from "react-syntax-highlighter/dist/esm/languages/prism/csharp";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import ruby from "react-syntax-highlighter/dist/esm/languages/prism/ruby";
import php from "react-syntax-highlighter/dist/esm/languages/prism/php";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import docker from "react-syntax-highlighter/dist/esm/languages/prism/docker";
import kotlin from "react-syntax-highlighter/dist/esm/languages/prism/kotlin";
import swift from "react-syntax-highlighter/dist/esm/languages/prism/swift";

// --- 언어 등록 시작 (대소문자 케이스 및 별칭 포함) ---
SyntaxHighlighter.registerLanguage("jsx", jsx);

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("JavaScript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);

SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("TypeScript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);

SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("json", json);

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("Bash", bash);
SyntaxHighlighter.registerLanguage("shell", bash);

SyntaxHighlighter.registerLanguage("markdown", markdownLang);
SyntaxHighlighter.registerLanguage("Markdown", markdownLang);
SyntaxHighlighter.registerLanguage("md", markdownLang);

SyntaxHighlighter.registerLanguage("java", java_lang);
SyntaxHighlighter.registerLanguage("Java", java_lang);

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("Python", python);
SyntaxHighlighter.registerLanguage("py", python);

SyntaxHighlighter.registerLanguage("dart", dart);
SyntaxHighlighter.registerLanguage("Dart", dart);

SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("C", c);

SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("Cpp", cpp);
SyntaxHighlighter.registerLanguage("c++", cpp);
SyntaxHighlighter.registerLanguage("C++", cpp);

SyntaxHighlighter.registerLanguage("csharp", csharp);
SyntaxHighlighter.registerLanguage("Csharp", csharp);
SyntaxHighlighter.registerLanguage("cs", csharp);
SyntaxHighlighter.registerLanguage("Cs", csharp);
SyntaxHighlighter.registerLanguage("dotnet", csharp);

SyntaxHighlighter.registerLanguage("rust", rust);
SyntaxHighlighter.registerLanguage("Rust", rust);
SyntaxHighlighter.registerLanguage("rs", rust);

SyntaxHighlighter.registerLanguage("go", go);
SyntaxHighlighter.registerLanguage("Go", go);
SyntaxHighlighter.registerLanguage("golang", go);
SyntaxHighlighter.registerLanguage("Golang", go);

SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("Ruby", ruby);
SyntaxHighlighter.registerLanguage("rb", ruby);

SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("Php", php);

SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("Sql", sql);

SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("Yaml", yaml);
SyntaxHighlighter.registerLanguage("yml", yaml);

SyntaxHighlighter.registerLanguage("dockerfile", docker);
SyntaxHighlighter.registerLanguage("Dockerfile", docker);
SyntaxHighlighter.registerLanguage("docker", docker);
SyntaxHighlighter.registerLanguage("Docker", docker);

SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("Kotlin", kotlin);
SyntaxHighlighter.registerLanguage("kt", kotlin);

SyntaxHighlighter.registerLanguage("swift", swift);
SyntaxHighlighter.registerLanguage("Swift", swift);
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
  const { resolvedTheme } = useTheme();
  const [currentSyntaxTheme, setCurrentSyntaxTheme] = useState(solarizedlight);

  useEffect(() => {
    setCurrentSyntaxTheme(resolvedTheme === "dark" ? nord : solarizedlight);
  }, [resolvedTheme]);

  const customMarkdownComponents: Components = {
    code({ node, inline, className, children, ...props }: CustomCodeProps) {
      const match = /language-(\w+)/.exec(className || "");
      // ⭐ 소문자 변환 로직 제거, 원본 언어 식별자 사용
      const language = match && match[1] ? match[1] : "text";
      const content = String(children);

      const effectivelyInline =
        inline || (content.length < 80 && !content.includes("\n"));

      if (!effectivelyInline) {
        return (
          <SyntaxHighlighter
            style={currentSyntaxTheme}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: "1rem",
              borderRadius: "4px",
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

  if (!markdownContent) {
    return (
      <p className="text-[var(--foreground-muted)] transition-colors duration-150 ease-in-out">
        Content is empty or not available.
      </p>
    );
  }

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
