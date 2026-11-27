# AI Portfolio Assistant Repair Specification

## Requirements

### Requirement: Intent-Accurate Work Experience & Natural Bilingual Formatting
Questions asking about Adrian's work history (including Indonesian queries mentioning his name such as `"berikan apa saja pengalaman adrian ?"` or `"Adrian pernah kerja di mana?"`) SHALL classify cleanly as `work_experience`, retrieve professional employment records first rather than unrelated GitHub repositories matching `"adrian"`, and format both AI answers and local fallbacks in natural language without raw `Project | Summary | Description` pipe metadata.

#### Scenario: Work experience query avoids repo-name pollution in local and AI paths
- **WHEN** a visitor asks `"berikan apa saja pengalaman adrian ?"`
- **THEN** retrieved context and any fallback reply prioritize Berijalan Techno Center, Qiscus, Tokopedia, and Bitbybit Studio professional records
- **AND** unrelated repositories containing `"Adrian"` in their title/slug are excluded from the answer

### Requirement: Genuine Upstream Inference Priority & Clean Streaming
For open-ended questions not covered by strict preset greetings/contact FAQs, `/api/chat` SHALL attempt real upstream inference in order (`Groq -> Gemini -> OpenRouter Free`), sanitize any `<think>...</think>` reasoning spans incrementally before streaming, and fall back to natural local knowledge only after eligible providers exhaust or fail.

#### Scenario: Live Vercel endpoint serves real AI inference and graceful fallback
- **WHEN** Vercel Sensitive Environment Variables are configured for Groq, Gemini, and OpenRouter
- **THEN** open-ended questions return `mode: "ai"` from an eligible upstream provider with clean Markdown output
- **AND** confidential PII queries remain blocked locally with `mode: "guardrail"` and zero upstream requests
