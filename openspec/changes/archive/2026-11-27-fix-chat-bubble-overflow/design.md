# Design: Chat Flex Containment & Bounded Markdown Renderer

1. **Flexbox Width Containment (`ChatWidget.tsx`):**
   - Apply `min-w-0` on the thread scroll container (`overflow-x-hidden overflow-y-auto`), per-message row wrappers (`min-w-0 max-w-full`), and bubble containers (`min-w-0 max-w-[90%] box-border [overflow-wrap:anywhere]`).
   - Wrap user paragraph text, verified link chips (`LINK_CHIP_CLASS`), and suggested prompt buttons cleanly using `min-w-0 max-w-full [overflow-wrap:anywhere]`.
2. **Markdown Containment & Fenced Code Blocks (`renderSafeText.tsx`):**
   - Render block elements (`div`, `p`, `ul`, `ol`, `li`, `a`, `Link`, inline `code`) with `min-w-0 max-w-full [overflow-wrap:anywhere]`.
   - Support fenced code blocks (` ```lang ... ``` `, including partial unclosed blocks during streaming) inside bounded `<pre className="... max-w-full min-w-0 overflow-x-auto ...">` containers.
3. **Markdown Security Bounds (`MARKDOWN_SECURITY_LIMITS`):**
   - Sanitize control characters, bound max text length (`12,000` chars), max lines (`220`), max code block chars (`4,000`), max list items (`60`), max inline tokens per line (`100`), and max URL length (`1,024`).
   - Harden `isSafeLinkHref` to reject protocol-relative `//`, `/\`, embedded URL credentials (`user@host`), and non-`https:` / non-`/` / invalid `mailto:` links without `dangerouslySetInnerHTML`.
