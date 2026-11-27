# AI Portfolio Assistant Chat Bubble & Markdown Delta Spec

## Requirements

### Requirement: Overflow-Free Responsive Chat Bubbles & Local Code Scrolling
User and assistant chat bubbles inside `#ask-adrian-dialog` SHALL enforce `min-width: 0`, `max-width: 100%` containment, and `overflow-wrap: anywhere` so arbitrarily long URLs, unbroken repository names, Markdown bullet/ordered lists, inline code, and link chips wrap cleanly within bubble bounds without horizontal scrollbar leakage across `320px`–`1440px` viewports, while fenced code blocks scroll horizontally strictly inside their local `<pre>` container.

#### Scenario: Long unbroken URLs and repo slugs stay inside bubbles on narrow mobile
- **WHEN** a user sends or receives an assistant reply containing long unbroken URLs, underscores, snake_case repo slugs, and wide code blocks on `320px`, `375px`, `390px`, and `1440px` viewports
- **THEN** zero elements exceed bubble right bounds (`element.right <= bubble.right`) and the conversation thread has zero horizontal overflow (`thread.scrollWidth <= thread.clientWidth`)

### Requirement: Bounded & Sanitized Markdown Rendering
`SafeChatMarkdown` SHALL render strictly via React elements without `dangerouslySetInnerHTML`, enforce bounded character/line/list/token/code caps, strip unsafe ASCII control bytes, and allow only validated root-relative (`/...` excluding `//` and `/\`), credential-free `https://`, or valid `mailto:` URLs.
