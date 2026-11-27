import React from "react";
import Link from "next/link";

function isSafeLinkHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("https://") || href.startsWith("mailto:");
}

function renderInlineSegments(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const tokenRe = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = tokenRe.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${idx}`} className="font-semibold text-[#F2F0EC]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${idx}`}
          className="rounded bg-[#08090C] px-1 py-0.5 font-mono text-[12px] text-[#65C8F5]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m && isSafeLinkHref(m[2])) {
        const [, label, href] = m;
        if (href.startsWith("/")) {
          nodes.push(
            <Link
              key={`${keyPrefix}-l-${idx}`}
              href={href}
              prefetch={false}
              className="text-[#65C8F5] underline underline-offset-2 hover:text-[#F2F0EC]"
            >
              {label}
            </Link>
          );
        } else {
          nodes.push(
            <a
              key={`${keyPrefix}-l-${idx}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#65C8F5] underline underline-offset-2 hover:text-[#F2F0EC]"
            >
              {label}
            </a>
          );
        }
      } else {
        nodes.push(token);
      }
    }
    idx += 1;
    lastIndex = tokenRe.lastIndex;
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }
  return nodes;
}

/**
 * Safe structured Markdown-lite renderer using React elements only (never dangerouslySetInnerHTML).
 */
export function SafeChatMarkdown({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={key} className="my-1.5 space-y-1 pl-4 text-[13px] leading-relaxed list-disc marker:text-[#65C8F5]">
        {listItems.map((item, i) => (
          <li key={`${key}-${i}`}>{renderInlineSegments(item, `${key}-${i}`)}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line) {
      flushList(`list-${index}`);
      return;
    }
    if (/^(?:[-*]|\d+\.)\s+/.test(line)) {
      listItems.push(line.replace(/^(?:[-*]|\d+\.)\s+/, ""));
      return;
    }
    flushList(`list-before-${index}`);
    blocks.push(
      <p key={`p-${index}`} className="text-[13px] leading-relaxed">
        {renderInlineSegments(line, `p-${index}`)}
      </p>
    );
  });

  flushList("list-end");
  return <div className="space-y-1.5">{blocks}</div>;
}
