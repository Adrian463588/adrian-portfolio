# PRD SPRINT 09 — ASK ADRIAN: AI PERSONA & PORTFOLIO ASSISTANT

## 1. Product information

| Field | Description |
|---|---|
| Product | Ask Adrian |
| Version | 1.0 MVP |
| Sprint | Sprint 09 |
| Owner | Adrian Syah Abidin |
| Platform | Existing portfolio website |
| Deployment | Vercel |
| Architecture | Static frontend + minimal serverless backend |
| Primary provider | Groq |
| Fallback providers | Gemini, OpenRouter |
| Final fallback | Local preset Q&A |
| Knowledge base | Structured JSON |
| Target operational cost | Rp0 within eligible free-tier limits |

Website: https://adriansyahabidin.vercel.app/

GitHub: https://github.com/Adrian463588

## 2. Background

The current portfolio presents professional experience, education, certifications, skills, research, and personal engineering projects.

However, visitors must manually navigate multiple sections to discover relevant information.

Ask Adrian introduces an interactive AI assistant that helps visitors understand the portfolio owner's professional background through natural conversations.

The assistant must accurately represent approved information without impersonating the owner or inventing personal achievements.

## 3. Product objectives

- Improve recruiter and visitor experience.
- Provide natural conversations in Indonesian and English.
- Make professional information easier to discover.
- Explain technical projects at different levels of expertise.
- Demonstrate applied AI, knowledge retrieval, API orchestration, and DevSecOps capabilities.
- Maintain reliable responses when AI providers are unavailable.
- Minimize API consumption and operational costs.
- Protect API credentials and private information.
- Preserve all existing portfolio functionality.

## 4. Target users

### Recruiters and Human Capital

Discover professional experience, education, skills, certifications, career interests, and relevant projects.

### Technical hiring managers

Explore technical contributions, architectures, engineering decisions, testing experience, and implemented technologies.

### General visitors

Understand the owner's professional background and software projects through simple explanations.

### Researchers

Explore approved academic research, including Android Stress Detection, PPG processing, wearable computing, and on-device machine learning.

## 5. MVP scope

### In scope

- Floating Action Button.
- Responsive floating chat widget.
- AI persona.
- One structured JSON knowledge base.
- CV ingestion and normalization.
- LinkedIn profile import.
- Existing portfolio and GitHub data integration.
- Indonesian and English conversations.
- Preset question-and-answer routing.
- Groq integration with three credential slots.
- Gemini integration with three credential slots and eligibility gating.
- OpenRouter integration with three credential slots.
- Free-only model routing.
- Automatic provider fallback.
- Rate limiting.
- Secure server-side API keys.
- Streaming responses.
- Suggested questions.
- Chat settings.
- Session-based conversation history.
- Verified portfolio navigation links.
- Automated testing.
- Vercel deployment.

### Out of scope

- Fine-tuning.
- Vector databases.
- Multi-agent orchestration.
- Autonomous web browsing.
- Runtime LinkedIn scraping.
- User authentication.
- Public admin dashboard.
- Persistent conversation database.
- Voice cloning.
- Avatar generation.
- Paid inference models.
- Kubernetes.
- Dedicated VPS.
- Microservices.

## 6. Functional requirements

### FR-001 — Floating Action Button

Add an Ask Adrian FAB at the bottom-right corner of all appropriate public portfolio pages.

The FAB must:

- Remain visible during normal page navigation.
- Open and close the chatbot.
- Provide an accessible name.
- Support keyboard and touch interaction.
- Respect reduced-motion preferences.
- Avoid overlapping important navigation and content.

Do not automatically open the chatbot.

### FR-002 — Floating Chat Widget

Display a compact floating dialog on desktop and a responsive bottom sheet or fullscreen dialog on mobile.

Provide:

- Header.
- Approved profile avatar.
- AI identity disclosure.
- Conversation area.
- Suggested questions.
- Message input.
- Send action.
- Streaming indicator.
- Stop action.
- Retry action.
- Settings.
- Clear conversation.
- Close action.

### FR-003 — AI persona

Configure a consistent persona representing Adrian's professional profile.

Communication characteristics:

- Friendly.
- Professional.
- Natural.
- Concise.
- Approachable.
- Technically accurate.
- Adaptive to visitor expertise.

The assistant must clearly identify itself as an AI assistant representing Adrian, not Adrian himself.

Never claim to be the actual owner.

### FR-004 — Knowledge base

Maintain one canonical chatbot knowledge file:

`knowledge/adrian-knowledge.json`

Include:

- Schema version.
- Last updated timestamp.
- Persona configuration.
- Professional profile.
- Education.
- Professional experience.
- Technical skills.
- Certifications.
- Projects.
- Research.
- Career interests.
- Current activities, when confirmed.
- Approved public contact information.
- Verified source references.
- Preset Q&A.

Reuse existing portfolio data during knowledge generation.

Do not manually duplicate the entire portfolio dataset across multiple independently maintained files.

### FR-005 — Data ingestion

Use the following approved sources:

1. Owner-provided CV.
2. Owner-provided LinkedIn export or approved profile information.
3. Existing portfolio data.
4. Verified public GitHub repositories.
5. Owner-approved manual corrections.

Perform ingestion during development or build time, not during visitor conversations.

Normalize dates and terminology.

Deduplicate information.

Identify conflicting professional records.

Require owner review for unresolved factual conflicts.

Do not ingest raw CV documents into public assets.

Do not scrape restricted LinkedIn content.

### FR-006 — Lightweight knowledge retrieval

Implement a simple retrieval system using the JSON knowledge base.

Use:

- Normalized keyword matching.
- Indonesian and English synonyms.
- Project name aliases.
- Intent classification.
- Lightweight relevance scoring.

Fuse.js or MiniSearch may be introduced only if justified.

Do not introduce embeddings, vector databases, or paid retrieval services.

Retrieve only relevant information for each LLM request.

### FR-007 — Preset Q&A

Implement bilingual deterministic responses for frequently asked questions.

Initial intents:

- Greeting.
- Professional introduction.
- Education.
- Professional experience.
- Berijalan Techno Center.
- QA and automation experience.
- DevOps experience.
- Technical skills.
- Certifications.
- Featured projects.
- Android Stress Detection.
- Career interests.
- Current activities.
- Contact information.
- Résumé availability.

Preset answers must derive from verified knowledge records.

Use FAQ-first routing for sufficiently confident matches.

Do not return unrelated canned responses when intent confidence is low.

### FR-008 — Groq primary provider

Support three server-side credential slots:

- GROQ_API_KEY_1
- GROQ_API_KEY_2
- GROQ_API_KEY_3

Use Groq as the first eligible AI provider.

Use only a verified free-tier-compatible model.

Attempt credential failover for invalid or unavailable credentials where permitted.

Respect organization-level quota restrictions.

Do not cycle through credentials to bypass shared quotas.

### FR-009 — Gemini fallback provider

Support:

- GEMINI_API_KEY_1
- GEMINI_API_KEY_2
- GEMINI_API_KEY_3

Implement Gemini as the second provider adapter.

Default configuration:

`GEMINI_ENABLED=false`

Enable live Gemini requests only after applicable service requirements, regional availability, age restrictions, and data-handling obligations have been satisfied.

Respect project-level rate limits.

Do not create projects or accounts to circumvent quota restrictions.

### FR-010 — OpenRouter fallback provider

Support:

- OPENROUTER_API_KEY_1
- OPENROUTER_API_KEY_2
- OPENROUTER_API_KEY_3

Use verified free-only models.

Recommended configurable router:

`openrouter/free`

Alternatively, use an explicitly verified model with a free variant.

Do not automatically fall back to paid models.

Respect account-level and model-level limits.

### FR-011 — Automatic fallback

Provider priority:

Groq → Gemini, when eligible → OpenRouter → Local FAQ.

For each provider:

1. Identify eligible credentials.
2. Skip missing or disabled credentials.
3. Use an available credential.
4. Classify any failure.
5. Rotate credentials only when the failure is credential-specific and failover is permitted.
6. Skip the provider when its shared quota is exhausted.
7. Continue to the next eligible provider.
8. Return a deterministic local answer when no provider succeeds.

Use sequential attempts, bounded timeouts, and a global request deadline.

Do not race all providers simultaneously.

Do not resend a request indefinitely.

### FR-012 — Streaming

Support streaming text when available.

Fallback is permitted before meaningful answer content has been sent.

If the stream fails after content has been displayed:

- Mark the response incomplete.
- Preserve the partial response.
- Show Retry.
- Do not append output from a different provider to the partial answer.

### FR-013 — Local fallback

The chatbot must remain useful without LLM provider access.

When all providers fail:

- Search approved FAQ entries.
- Retrieve relevant verified knowledge records.
- Return a deterministic answer.
- Provide relevant verified links.
- Explain when a question cannot be answered in local mode.

Never display raw API errors.

### FR-014 — Chat settings

Visitor settings:

- Language: Auto / Indonesian / English.
- Response detail: Concise / Detailed.
- Clear conversation.
- Optional motion preference.

Owner settings:

- Persona.
- Knowledge base.
- Provider priorities.
- Model IDs.
- Provider enable flags.
- Rate limits.
- Token limits.
- Request deadline.

Owner settings must remain server-side or development-time configuration.

Do not expose API key configuration to visitors.

### FR-015 — Portfolio navigation

The assistant may recommend verified links to:

- Experience.
- About.
- Contact.
- Public project detail pages.
- GitHub repositories.
- LinkedIn.
- Approved résumé.

Use a server-controlled link allowlist or source registry.

Do not display hallucinated URLs.

Preserve informational-only presentation for internal Berijalan projects.

### FR-016 — Session history

Store conversation history in sessionStorage.

Support clearing history.

Do not persist visitor conversations to a database.

Treat client-submitted history as untrusted.

Validate message roles and content.

Do not accept client-generated system or developer messages.

## 7. Non-functional requirements

### NFR-001 — Performance

- Lazy-load chat components.
- Do not initialize provider SDKs when the homepage loads.
- Preserve existing Core Web Vitals.
- Keep decorative animations non-blocking.
- Limit message history and prompt size.

### NFR-002 — Reliability

- Graceful degradation.
- Bounded provider retries.
- Automatic local fallback.
- No infinite retry loops.
- No duplicate responses.
- No application crash when credentials are missing.

### NFR-003 — Security

- Server-side secrets only.
- Strict request validation.
- Distributed rate limiting.
- Shared global API budget.
- Output sanitization.
- Prompt injection resistance.
- Secret scanning.
- Safe error handling.
- No confidential information in public assets.

### NFR-004 — Accessibility

Target WCAG 2.2 AA.

Support:

- Keyboard navigation.
- Visible focus.
- Escape to close.
- Appropriate focus restoration.
- Screen-reader announcements.
- Accessible controls.
- Readable contrast.
- Touch-friendly targets.
- Reduced-motion behavior.

### NFR-005 — Maintainability

Use modular TypeScript architecture.

Apply:

- Clean Code.
- SOLID.
- DRY.
- KISS.
- YAGNI.
- Separation of Concerns.
- Test-driven development.

Avoid unnecessary abstraction layers.

### NFR-006 — Cost

Target Rp0 within provider and Vercel free-tier allowances.

Never use paid models automatically.

Disable automatic credit top-up where available.

When an applicable quota or budget is exhausted, serve local preset answers.

## 8. Proposed technical architecture

Frontend:

Existing React or Next.js application.

Chat UI:

Existing design system with reusable lightweight chat components.

Backend:

One Vercel serverless endpoint.

`POST /api/chat`

Provider integration:

Native fetch or Vercel AI SDK, selected according to the existing repository.

Knowledge:

One canonical server-side JSON file.

Retrieval:

Keyword search with optional lightweight fuzzy matching.

Rate limiting:

Distributed free-tier-compatible store, such as Upstash Redis.

No application database is required.

If the distributed limiter fails, disable external inference and use local FAQ.

## 9. API contract

Endpoint:

POST /api/chat

Accepted request:

- message: string
- history: validated user/assistant messages
- language: auto | id | en
- detail: concise | detailed
- challengeToken: optional anti-bot token

The server must reject unexpected privileged fields.

The client must not control:

- API keys.
- Provider configuration.
- Model IDs.
- System prompts.
- Arbitrary upstream URLs.
- Maximum token budget.
- Knowledge base contents.

Response:

A consistent event stream or typed response protocol supporting:

- Answer content.
- Verified source references.
- Local fallback status.
- Completion state.
- Safe error code.
- Request identifier.

Do not expose raw upstream response bodies or credential identifiers.

## 10. Proposed operational limits

Initial configurable limits:

| Parameter | Initial value |
|---|---|
| Requests per visitor per minute | 5 |
| AI requests per visitor per day | 20 |
| Global upstream attempts per day | 100 |
| Maximum message length | 1,000 characters |
| Maximum history | 6 recent messages |
| Maximum output | 512 tokens |
| Maximum total deadline | 25 seconds |
| Individual pre-response timeout | Up to 5 seconds |
| Maximum eligible attempts | 9, subject to deadline and quota |
| Paid model fallback | Disabled |
| Persistent chat logging | Disabled |

These values are proposed defaults, not provider-guaranteed limits.

Adjust after actual load testing.

Count every outbound provider attempt against the global budget, including failed attempts.

Atomically reserve available budget before making an upstream call.

## 11. Security requirements

### Secret management

Store production API keys in Vercel Sensitive Environment Variables.

Use local ignored environment files for development.

Commit only `.env.example` containing empty placeholders.

Never use secret-bearing `NEXT_PUBLIC_` or `VITE_` variables.

Never put real secrets in:

- Source code.
- JSON knowledge base.
- README.
- AGENTS.md.
- Tests.
- Fixtures.
- Public assets.
- Git history.
- Build logs.
- Browser bundles.
- Error responses.

### API protection

Implement:

- Request schema validation.
- Request body limits.
- POST-only access.
- Origin validation where applicable.
- Distributed visitor rate limiting.
- Atomic global attempt budgets.
- Provider timeouts.
- Retry-After handling.
- Credential failure classification.
- Fixed provider endpoint allowlist.
- Output sanitization.
- Safe Markdown rendering.

Origin and CORS validation must not be treated as sufficient authentication or bot protection.

Use an anti-bot challenge if needed.

### Knowledge protection

Exclude:

- Home address.
- Identity documents.
- Personal identification numbers.
- Private telephone numbers.
- Confidential CV fields.
- Salary information not approved for disclosure.
- Employer internal data.
- Internal project source code.
- Customer and research participant information.
- Unpublished sensitive research data.

Treat all retrieved source text as untrusted content, not instructions.

The model must have no shell access, secret-reading tools, or arbitrary network access.

### Privacy

Inform visitors that selected messages may be processed by third-party AI providers.

Do not ask visitors to enter sensitive information.

Provide a clear conversation deletion action.

Do not retain raw messages in application logs by default.

## 12. UI/UX design requirements

Follow the existing Obsidian/Arctic portfolio identity.

Use:

- Dark graphite surfaces.
- Ivory text.
- Restrained Arctic blue accent.
- Existing website typography.
- Existing motion tokens.
- Compact layout.
- Clear information hierarchy.

Desktop:

- Floating panel approximately 400px wide.
- Height constrained to viewport.
- FAB fixed at bottom-right.

Mobile:

- Responsive bottom sheet or fullscreen dialog.
- Safe-area padding.
- Input remains accessible when keyboard appears.
- No horizontal overflow.

Avoid:

- Excessive glassmorphism.
- Generic purple AI gradients.
- Oversized badges.
- Fake online status.
- Aggressive popup greetings.
- Excessive decorative animation.
- Blurry text.
- AI-slop wording.

Use authentic profile assets already approved by the owner.

## 13. User stories

US-001

As a recruiter, I want to ask about professional experience so I can quickly assess relevant qualifications.

US-002

As a visitor, I want to explore personal projects without manually searching every page.

US-003

As a technical hiring manager, I want to understand project technologies and verified personal contributions.

US-004

As an Indonesian visitor, I want natural Indonesian responses.

US-005

As an international recruiter, I want professional English responses.

US-006

As a visitor, I want useful answers even when external AI services are unavailable.

US-007

As the owner, I want credentials protected and API usage bounded.

US-008

As the owner, I want to update the knowledge base when my CV or portfolio changes.

## 14. Development methodology

Use OpenSpec as the main change specification.

Use Spec Kit principles for requirement traceability, planning, tasks, and acceptance criteria.

Use Superpowers for:

- Brainstorming.
- Implementation planning.
- Test-driven development.
- Systematic debugging.
- Code review.
- Verification before completion.

Do not maintain multiple competing specifications containing identical requirements.

Suggested change structure:

openspec/changes/ask-adrian/

- proposal.md
- design.md
- tasks.md
- specs/ai-portfolio-assistant/spec.md

Reuse existing Spec Kit conventions when already established.

## 15. Implementation phases

### Phase A — Audit and specification

Inspect current architecture, deployment, project data, existing tests, and design system.

Finalize requirements and acceptance criteria.

### Phase B — Knowledge and persona

Create JSON schema, ingestion workflow, bilingual FAQ, retrieval, source registry, and persona rules.

### Phase C — Backend and provider adapters

Implement the API endpoint, Groq adapter, Gemini adapter, OpenRouter adapter, credential handling, and fallback orchestrator.

### Phase D — Security

Implement validation, rate limiting, global budget, privacy controls, error sanitization, and secret scanning.

### Phase E — Frontend

Implement FAB, chat widget, message rendering, settings, streaming, and responsive behavior.

### Phase F — Verification

Run unit, integration, end-to-end, security, accessibility, and portfolio regression testing.

### Phase G — Deployment

Configure Vercel environment variables, deploy preview, validate live behavior, and prepare production release.

## 16. Acceptance criteria

| ID | Scenario | Expected behavior |
|---|---|---|
| AC-001 | Visitor opens FAB | Chat opens without navigation |
| AC-002 | Visitor sends greeting | Local greeting returned without LLM call |
| AC-003 | Visitor asks known FAQ | Verified preset response |
| AC-004 | Visitor asks detailed project question | Relevant knowledge retrieved and AI responds |
| AC-005 | Groq primary key is invalid | Next permitted credential used |
| AC-006 | Groq shared quota exhausted | Skip Groq and use next eligible provider |
| AC-007 | Gemini disabled | No Gemini API request |
| AC-008 | Eligible Gemini credentials fail | OpenRouter considered |
| AC-009 | OpenRouter quota exhausted | Local fallback returned |
| AC-010 | All keys missing | Local FAQ remains available |
| AC-011 | Input exceeds limit | Safe validation error |
| AC-012 | Visitor exceeds AI quota | External inference blocked |
| AC-013 | Global budget exhausted | Local answer only |
| AC-014 | Stream interrupted | Incomplete state and Retry shown |
| AC-015 | User requests API credentials | No credentials disclosed |
| AC-016 | User submits prompt injection | Persona and data boundaries maintained |
| AC-017 | User requests unknown facts | Assistant acknowledges uncertainty |
| AC-018 | User changes language | Corresponding language used |
| AC-019 | User clears conversation | Session history removed |
| AC-020 | Mobile keyboard opens | Input remains usable |
| AC-021 | Portfolio navigation tested | Existing links remain functional |
| AC-022 | Production assets scanned | No real API secrets exposed |
| AC-023 | Knowledge source conflict | Conflict reported for owner review |
| AC-024 | Production build executed | Build and serverless endpoint succeed |

## 17. Release criteria

The release requires:

- All mandatory unit tests passing.
- Provider fallback verified through mocked failure scenarios.
- Real provider smoke tests where credentials are available.
- No exposed API keys.
- No confirmed critical security vulnerabilities.
- No broken existing portfolio functionality.
- Successful production build.
- Successful Vercel preview verification.

If CV, LinkedIn data, credentials, or deployment access are unavailable, report the corresponding requirement as BLOCKED or NOT VERIFIED.

Do not fabricate implementation or test success.

## 18. Deliverables

- AI persona chatbot.
- JSON knowledge base.
- Knowledge validation or generation script.
- Provider adapters.
- Fallback orchestrator.
- Serverless API endpoint.
- Rate limiting and budget controls.
- Secure environment template.
- Bilingual FAQ.
- Chat UI components.
- Unit and integration tests.
- Playwright regression tests.
- Updated README.
- Deployment guide.
- DevSecOps verification report.
- Final acceptance checklist.