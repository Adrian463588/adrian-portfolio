# AI Portfolio Assistant Specification

## Requirements

### Requirement: Canonical Sanitized Knowledge & Privacy Boundaries
The assistant SHALL answer strictly from `knowledge/adrian-knowledge.json` and curated bilingual FAQs derived from verified portfolio modules and sanitized public-safe CV highlights, MUST exclude phone numbers, street addresses, age, date of birth, identity numbers, secret credentials, and confidential Berijalan internals, and MUST refuse sensitive personal data requests without invoking upstream LLM APIs.

#### Scenario: Visitor asks for sensitive personal information (PII guardrail)
- **WHEN** a visitor asks for Adrian's phone number, home address, age, date of birth, NIK/KTP, or internal API keys
- **THEN** the backend guardrail intercepts the query before any LLM call
- **AND** returns a polite refusal in the matching language (`id` or `en`) redirecting to public contact links (`adriansyah1230@gmail.com`, LinkedIn)

### Requirement: FAQ-First Routing & Lightweight Bilingual Retrieval
Strict greetings and exact chip FAQs SHALL resolve locally with zero upstream LLM requests, while open-ended questions (including follow-ups with conversation history and Indonesian queries containing Adrian's name such as `"berikan apa saja pengalaman adrian ?"`) SHALL classify intent cleanly (`work_experience`, `current_activities`, `academic_research`, `projects`, `technical_skills`, etc.), exclude unrelated GitHub repository-name noise, retrieve verified natural prose snippets with allowlisted URLs only, and invoke real AI inference cleanly without dumping raw `Project | Summary | Description` pipes.

#### Scenario: Work experience query avoids repo-name pollution and enters AI inference
- **WHEN** a visitor asks `"berikan apa saja pengalaman adrian ?"`
- **THEN** `/api/chat` bypasses static FAQ interception, classifies intent as `work_experience`, prioritizes Berijalan Techno Center, Qiscus, Tokopedia, and Bitbybit Studio records, and excludes unrelated repository slugs containing `"Adrian"`

### Requirement: Bounded Multi-Provider Fallback & Free-Only Enforcement
When external inference is needed, `/api/chat` SHALL try eligible providers sequentially (`Groq -> Gemini -> OpenRouter Free -> Local Fallback`), strip `<think>...</think>` reasoning spans incrementally during SSE and JSON responses, enforce strict input/history validation, visitor rate limits, atomic global attempt budgets, `7s` pre-response timeouts (up to `12s` cap), `25s` total deadline, and `openrouter/free` / `:free` model restrictions without ever falling back to paid models or leaking credentials/raw upstream errors.

#### Scenario: Primary provider fails and secondary provider responds
- **WHEN** Groq keys fail credential or quota checks while Gemini (`GEMINI_ENABLED=true`) or OpenRouter is available
- **THEN** the orchestrator classifies the error, advances deterministically through eligible slots/providers, or falls back to grounded local retrieval if all providers fail

### Requirement: Accessible Lazy-Loaded Obsidian & Arctic Chat UI
The portfolio SHALL render a lazy-loaded bottom-right FAB (`Ask Adrian`) and responsive desktop/mobile chat dialog supporting streaming text, Stop/Retry, up to 3 localized suggested questions, Auto/ID/EN language toggle, Concise/Detailed toggle, `sessionStorage` history with Clear Conversation, keyboard navigation (`Escape` closes and restores focus), and zero interference with WebGL or page scrolling.

### Requirement: Overflow-Free Responsive Chat Bubbles & Bounded Markdown Rendering
User and assistant chat bubbles inside `#ask-adrian-dialog` SHALL enforce `min-width: 0`, `max-width: 100%` containment, and `overflow-wrap: anywhere` so arbitrarily long URLs, unbroken repository slugs, bullet/ordered lists, inline code, and link chips wrap cleanly across `320px`–`1440px` without horizontal overflow, while fenced code blocks scroll horizontally strictly inside local `<pre>` blocks. `SafeChatMarkdown` SHALL render strictly via React elements without `dangerouslySetInnerHTML`, enforce bounded character/line/list/token/code caps, sanitize ASCII control characters, and permit only root-relative (`/` excluding `//` and `/\`), credential-free `https://`, or valid `mailto:` links.
