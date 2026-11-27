import React from "react";
import Link from "next/link";

export const MARKDOWN_SECURITY_LIMITS = {
  maxChars: 12_000,
  maxLines: 220,
  maxCodeBlockChars: 4_000,
  maxListItems: 60,
  maxInlineTokensPerLine: 100,
  maxUrlLength: 1_024,
} as const;

const WRAP_CONTAINED = "min-w-0 max-w-full [overflow-wrap:anywhere]";
const CONTROL_CHAR_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function normalizeSafeMarkdownInput(text: string): string {
  const cleaned = text.replace(CONTROL_CHAR_RE, "");
  if (cleaned.length <= MARKDOWN_SECURITY_LIMITS.maxChars) {
    return cleaned;
  }
  return `${cleaned.slice(0, MARKDOWN_SECURITY_LIMITS.maxChars - 1)}…`;
}

export function isSafeLinkHref(rawHref: string): boolean {
  const href = rawHref.trim();
  if (
    !href ||
    href.length > MARKDOWN_SECURITY_LIMITS.maxUrlLength ||
    /[\s\\]/.test(href)
  ) {
    return false;
  }

  // Root-relative only (strictly reject protocol-relative `//` or `/\`)
  if (href.startsWith("/")) {
    return !href.startsWith("//") && !href.startsWith("/\\");
  }

  if (href.startsWith("mailto:")) {
    return /^mailto:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(href);
  }

  if (href.startsWith("https://")) {
    try {
      const parsed = new URL(href);
      return (
        parsed.protocol === "https:" &&
        !parsed.username &&
        !parsed.password &&
        parsed.hostname.length > 0
      );
    } catch {
      return false;
    }
  }

  return false;
}

function renderInlineSegments(line: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const tokenRe = /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = tokenRe.exec(line)) !== null) {
    if (idx >= MARKDOWN_SECURITY_LIMITS.maxInlineTokensPerLine) {
      break;
    }
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong
          key={`${keyPrefix}-b-${idx}`}
          className="font-semibold text-[#F2F0EC] [overflow-wrap:anywhere]"
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-c-${idx}`}
          className="rounded bg-[#08090C] px-1 py-0.5 font-mono text-[12px] text-[#65C8F5] [overflow-wrap:anywhere]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const m = token.match(/^\[([^\]\n]+)\]\(([^)\s]+)\)$/);
      if (m && isSafeLinkHref(m[2])) {
        const label = m[1];
        const href = m[2].trim();
        const linkCls =
          "text-[#65C8F5] underline underline-offset-2 hover:text-[#F2F0EC] [overflow-wrap:anywhere]";
        if (href.startsWith("/")) {
          nodes.push(
            <Link key={`${keyPrefix}-l-${idx}`} href={href} prefetch={false} className={linkCls}>
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
              className={linkCls}
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
 * Safe bounded Markdown renderer using React elements only (never dangerouslySetInnerHTML).
 * Wraps arbitrary prose/URLs/slugs within parent width while scoping code scroll locally.
 */
export function SafeChatMarkdown({ text }: { text: string }) {
  const safeInput = normalizeSafeMarkdownInput(text);
  const allLines = safeInput.split(/\r?\n/);
  const lines = allLines.slice(0, MARKDOWN_SECURITY_LIMITS.maxLines);
  const truncatedLines = allLines.length > MARKDOWN_SECURITY_LIMITS.maxLines;

  const blocks: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];
  let totalListItems = 0;
  let inCodeBlock = false;
  let codeLines: string[] = [];

  const flushCodeBlock = (key: string) => {
    if (!inCodeBlock) return;
    const rawCode = codeLines.join("\n");
    const clippedCode =
      rawCode.length > MARKDOWN_SECURITY_LIMITS.maxCodeBlockChars
        ? `${rawCode.slice(0, MARKDOWN_SECURITY_LIMITS.maxCodeBlockChars - 1)}…`
        : rawCode;
    blocks.push(
      <pre
        key={key}
        className="my-1.5 min-w-0 max-w-full overflow-x-auto rounded-lg border border-white/10 bg-[#08090C] p-2.5 font-mono text-[12px] leading-relaxed text-[#E6E4DF]"
      >
        <code className="whitespace-pre">{clippedCode}</code>
      </pre>
    );
    inCodeBlock = false;
    codeLines = [];
  };

  const flushList = (key: string) => {
    if (listItems.length === 0 || !listType) return;
    const listClasses =
      listType === "ol"
        ? `my-1.5 ${WRAP_CONTAINED} list-decimal space-y-1 pl-5 text-[13px] leading-relaxed marker:text-[#65C8F5]`
        : `my-1.5 ${WRAP_CONTAINED} list-disc space-y-1 pl-4 text-[13px] leading-relaxed marker:text-[#65C8F5]`;

    const children = listItems.map((item, i) => (
      <li key={`${key}-${i}`} className="min-w-0 [overflow-wrap:anywhere]">
        {renderInlineSegments(item, `${key}-${i}`)}
      </li>
    ));

    blocks.push(
      listType === "ol" ? (
        <ol key={key} className={listClasses}>
          {children}
        </ol>
      ) : (
        <ul key={key} className={listClasses}>
          {children}
        </ul>
      )
    );
    listType = null;
    listItems = [];
  };

  lines.forEach((rawLine, index) => {
    const trimmed = rawLine.trim();

    if (/^```/.test(trimmed)) {
      flushList(`list-before-code-${index}`);
      if (inCodeBlock) {
        flushCodeBlock(`code-${index}`);
      } else {
        inCodeBlock = true;
        codeLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      return;
    }

    if (!trimmed) {
      flushList(`list-${index}`);
      return;
    }

    const isUnordered = /^[-*]\s+/.test(trimmed);
    const isOrdered = /^\d+\.\s+/.test(trimmed);

    if (isUnordered || isOrdered) {
      if (totalListItems >= MARKDOWN_SECURITY_LIMITS.maxListItems) {
        return;
      }
      const nextType = isOrdered ? "ol" : "ul";
      if (listType && listType !== nextType) {
        flushList(`list-switch-${index}`);
      }
      listType = nextType;
      listItems.push(trimmed.replace(/^(?:[-*]|\d+\.)\s+/, ""));
      totalListItems += 1;
      return;
    }

    flushList(`list-before-${index}`);
    blocks.push(
      <p key={`p-${index}`} className={`${WRAP_CONTAINED} text-[13px] leading-relaxed`}>
        {renderInlineSegments(trimmed, `p-${index}`)}
      </p>
    );
  });

  flushCodeBlock("code-end");
  flushList("list-end");

  if (truncatedLines) {
    blocks.push(
      <p key="truncated-note" className={`${WRAP_CONTAINED} text-[12px] text-[#A7ADB7]`}>
        …
      </p>
    );
  }

  return <div className={`${WRAP_CONTAINED} space-y-1.5`}>{blocks}</div>;
}
