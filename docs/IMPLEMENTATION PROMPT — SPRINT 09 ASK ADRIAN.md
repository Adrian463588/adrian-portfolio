# IMPLEMENTATION PROMPT — SPRINT 09: ASK ADRIAN

Act as a Senior Full-Stack Engineer, AI Engineer, UI/UX Designer, DevSecOps Engineer, and QA Automation Engineer.

Implement Ask Adrian, a professional AI persona chatbot, on my existing portfolio website.

Website:

https://adriansyahabidin.vercel.app/

GitHub:

https://github.com/Adrian463588

Use `PRD_SPRINT_09_AI_PORTFOLIO_ASSISTANT.md` as the authoritative product specification.

Execute the implementation directly. Do not stop at read-only analysis or recommendations.

## 1. Methodology

Use:

- OpenSpec for change specification.
- Spec Kit principles for requirements, implementation plans, tasks, and acceptance criteria.
- Superpowers for brainstorming, TDD, systematic debugging, code review, and verification before completion.

References:

https://github.com/Fission-AI/OpenSpec

https://github.com/github/spec-kit

https://github.com/obra/superpowers

Avoid duplicating specifications across these methodologies.

Apply Clean Code, SOLID, DRY, KISS, YAGNI, modular architecture, and separation of concerns.

Use the smallest reliable implementation.

## 2. Audit existing project

Read AGENTS.md, README.md, existing specifications, architecture, package.json, project data, UI components, Vercel configuration, and test suites.

Identify the actual framework and routing strategy.

Preserve all existing portfolio content, Three.js, parallax, microinteractions, project ordering, hover behavior, image rendering, navigation, and SEO.

Do not perform an unrelated redesign.

Create a dedicated feature branch while preserving existing user changes.

Suggested branch:

`feat/sprint-09-ask-adrian`

## 3. Implement knowledge base

Create one canonical file:

`knowledge/adrian-knowledge.json`

Generate or update it using:

- Owner-provided CV.
- Owner-approved LinkedIn export.
- Existing portfolio data.
- Public GitHub repository information.
- Approved manual corrections.

Include persona, professional profile, education, work experience, skills, certifications, projects, research, career interests, current activities, FAQ, and verified source references.

Reuse existing data as the source of truth.

Do not maintain unnecessary duplicate datasets.

Sanitize private CV fields and confidential employer information.

Validate JSON using a lightweight schema.

Report conflicting or missing information.

Do not fabricate unavailable CV or LinkedIn data.

If those files have not been supplied, implement the ingestion workflow and use only currently verified portfolio information.

## 4. Implement persona and retrieval

Create a consistent persona for all providers.

The assistant must be natural, professional, bilingual, concise, and adaptable to visitor expertise.

Clearly disclose that it is Adrian's AI assistant, not Adrian himself.

Implement lightweight keyword retrieval from the JSON knowledge base.

Use project aliases and bilingual synonyms.

Retrieve relevant knowledge only.

Do not use a vector database, fine-tuning, LangChain, or additional AI classifiers unless genuinely necessary.

Use approved source IDs and link allowlists.

Never invent professional experience, project features, research results, current activities, or URLs.

## 5. Implement local FAQ first

Create deterministic bilingual preset answers for greetings, profile, education, experience, skills, certifications, featured projects, career interests, current activities, résumé availability, and contact.

Use FAQ-first routing for sufficiently confident matches.

Known FAQ questions must generate zero upstream LLM requests.

When no preset matches, retrieve relevant knowledge and use the AI provider orchestrator.

When all external providers fail, return the most relevant verified local response or acknowledge the limitation.

Do not present local FAQ as live LLM inference.

## 6. Implement secure serverless backend

Add one serverless endpoint:

`POST /api/chat`

If using Vite, use a compatible Vercel Function.

If using Next.js App Router, use a server-side Route Handler with a supported runtime deployment.

If strict static export is currently enabled, resolve the incompatibility without sacrificing static generation of existing portfolio pages.

Do not introduce Express, VPS, microservices, an application database, or authentication.

Use existing framework capabilities.

Validate request input and history.

Do not allow visitors to control system prompts, model IDs, API keys, provider endpoints, or token budgets.

## 7. Implement provider adapters

Use a common provider interface and a small orchestration layer.

Provider order:

1. Groq.
2. Gemini when eligible and enabled.
3. OpenRouter.
4. Local FAQ.

Groq credentials:

- GROQ_API_KEY_1
- GROQ_API_KEY_2
- GROQ_API_KEY_3

Gemini credentials:

- GEMINI_API_KEY_1
- GEMINI_API_KEY_2
- GEMINI_API_KEY_3

OpenRouter credentials:

- OPENROUTER_API_KEY_1
- OPENROUTER_API_KEY_2
- OPENROUTER_API_KEY_3

Use Groq as the primary provider.

Validate model availability and free-tier eligibility against official documentation and actual account configuration.

Support Gemini but disable live calls by default until its applicable service requirements are satisfied.

Use OpenRouter free models only.

Never switch to paid models automatically.

## 8. Implement automatic fallback

Support up to three credential slots per provider.

Skip missing credentials.

Rotate to another eligible credential when a failure is genuinely credential-specific and rotation is permitted.

For shared project, organization, or account quota exhaustion, skip the affected provider.

Respect Retry-After and applicable reset periods.

Do not bypass provider quotas by creating extra accounts or projects.

Use sequential bounded attempts and a global request deadline.

Handle:

- Invalid credentials.
- HTTP 429.
- Shared quota exhaustion.
- Provider service errors.
- Timeouts.
- Unavailable models.
- Disabled providers.
- Missing environment variables.
- Interrupted streams.

Do not expose raw upstream errors.

Do not retry invalid input across every provider.

Do not use fallback to evade content restrictions.

If streaming has already started, mark interrupted responses incomplete and offer Retry.

Always provide graceful local fallback.

## 9. Implement frontend chatbot

Add a floating Ask Adrian FAB at the bottom-right corner.

Implement:

- Compact floating chat widget.
- Responsive mobile bottom sheet or dialog.
- Existing approved profile avatar.
- AI assistant identity.
- Natural greeting.
- Suggested questions.
- User and assistant messages.
- Streaming.
- Typing/loading indicator.
- Send.
- Stop.
- Retry.
- Settings.
- Clear conversation.
- Close action.
- Verified source links.

Visitor settings:

- Auto / Indonesian / English.
- Concise / Detailed.
- Clear conversation.

Use sessionStorage for history.

Do not add a public provider settings screen.

Reuse existing colors, typography, and motion system.

Avoid AI-slop, excessive gradients, decorative badges, automatic popups, unnecessary animation, or generic chatbot templates that conflict with the portfolio.

Ensure the FAB and chat widget do not interfere with WebGL, custom cursors, navigation, mobile keyboards, or existing click targets.

## 10. Implement DevSecOps controls

Store every real API key exclusively in server-side environment variables.

Prepare `.env.example` with placeholders only.

Ignore `.env.local`, private source documents, and other sensitive files.

Never use NEXT_PUBLIC_ or VITE_ prefixes for secrets.

Implement:

- Input schema validation.
- Maximum request body size.
- Maximum message and history limits.
- Distributed rate limiting.
- Atomic global upstream attempt budget.
- Provider timeout.
- Request cancellation.
- Free-only model allowlist.
- Fixed upstream endpoint allowlist.
- Prompt injection resistance.
- Safe Markdown rendering.
- XSS protection.
- Verified links.
- Redacted logging.
- Safe error responses.
- Relevant security headers.
- Secret scanning.
- Dependency vulnerability audit.

Use Upstash Redis or an existing compatible distributed limiter.

If the limiter is unavailable, serve local FAQ instead of making unrestricted AI requests.

Do not treat CORS as sufficient abuse protection.

Use Turnstile if needed.

Do not store raw visitor conversations permanently.

Do not expose the complete CV or private knowledge records.

Do not log API credentials or raw Authorization headers.

## 11. Implement initial operational limits

Use configurable defaults:

- 5 requests per visitor per minute.
- 20 AI requests per visitor per day.
- 100 global upstream attempts per day.
- 1,000 characters per input.
- 6 recent conversation messages.
- 512 maximum output tokens.
- 5-second individual pre-response timeout.
- 25-second global request deadline.
- Free-only mode enabled.
- FAQ-first enabled.

Count all outbound attempts against the global budget.

Do not assume each API key provides an independent quota.

Adjust only when justified by actual provider limits and testing.

## 12. Preserve frontend performance and SEO

Lazy-load the chat widget.

Do not request an LLM when a visitor loads the website.

Do not block initial HTML rendering.

Preserve:

- Three.js.
- WebGL shaders.
- Parallax.
- Existing motion.
- Project navigation.
- Profile and project images.
- Selected Work ordering.
- Sitemap.
- Robots.
- Metadata.
- Canonical URLs.
- Existing accessibility.

Do not insert conversation content into indexable portfolio pages.

Ensure the chatbot remains usable when WebGL is unavailable.

## 13. Testing strategy

Use Superpowers test-driven development.

Write failing tests before implementing critical functionality.

Unit tests:

- Knowledge schema validation.
- FAQ matching.
- Bilingual retrieval.
- Provider priority.
- Credential-specific failover.
- Shared quota handling.
- Gemini eligibility flag.
- Free-only model selection.
- Global attempt budget.
- Timeout behavior.
- Missing credentials.
- Local fallback.

Integration tests:

- Groq invalid primary credential.
- Groq shared quota exhausted.
- Gemini skipped when disabled.
- Eligible Gemini failure.
- OpenRouter free model failure.
- All providers unavailable.
- Rate limiter unavailable.
- Concurrent budget reservation.
- Partial streaming interruption.
- Invalid input.
- Prompt injection scenarios.
- Safe error responses.

Mock providers for automated failure tests.

Use real credentials only for authorized minimal smoke tests.

Playwright tests:

- FAB opens and closes.
- Desktop and mobile responsive behavior.
- Suggested questions work.
- Greetings use local FAQ.
- Messages stream correctly.
- Settings work.
- History clears.
- Retry works.
- Keyboard navigation works.
- No overlay blocks clicks.
- No broken existing portfolio functionality.

Security verification:

- Run secret scanning on relevant Git history and working tree.
- Scan generated frontend assets for secret exposure.
- Inspect browser network responses.
- Verify no secret is returned by the chat endpoint.
- Verify private CV content is excluded.
- Verify paid model fallback is impossible under approved configuration.

Do not mark tests as passed unless executed.

## 14. Deployment

Discover actual package scripts.

Run lint, typecheck, unit tests, integration tests, E2E tests, asset validation, SEO validation, secret scanning, dependency audit, and production build.

Prepare Vercel environment variable setup instructions.

Never request that real credentials be committed to GitHub.

Create a Vercel Preview Deployment if authorized and available.

Test the endpoint on the preview deployment.

Deploy production only after required quality gates and user authorization are satisfied.

Target Vercel Hobby and eligible free provider tiers.

Do not promise unlimited free usage.

## 15. Required deliverables

- OpenSpec change specification.
- Implementation plan and tasks.
- Canonical JSON knowledge base.
- Knowledge ingestion and validation.
- Bilingual local FAQ.
- Three provider adapters.
- Nine credential slots.
- Provider fallback orchestrator.
- Secure serverless API.
- Responsive chatbot UI.
- Automated tests.
- `.env.example`.
- Updated README.
- Vercel setup guide.
- DevSecOps verification report.
- Final acceptance checklist.

## 16. Final report

Provide:

1. Features implemented.
2. Modified and added files.
3. Confirmed architecture.
4. Knowledge sources used.
5. Remaining missing CV or LinkedIn data.
6. Provider configuration status.
7. Mocked and live fallback test results.
8. Security findings.
9. Secret scanning results.
10. UI screenshots.
11. Responsive and accessibility test results.
12. Portfolio regression results.
13. Production build status.
14. Vercel deployment status.
15. Remaining limitations.
16. Acceptance checklist.

Use PASS, FAIL, BLOCKED, or NOT VERIFIED.

Do not fabricate results.

Proceed through audit, specification, implementation, TDD, security verification, regression testing, and deployment preparation.

Deliver a simple, secure, professional, reliable, and recruiter-friendly AI portfolio assistant without unnecessary architectural complexity.