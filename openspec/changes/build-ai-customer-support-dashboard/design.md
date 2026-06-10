## Context

This change defines a full MVP for an internal AI-assisted customer support product. The repository currently contains OpenSpec configuration but no existing feature specs, so this change establishes the first domain model, permission model, and product capability baseline. The product needs to balance realistic SaaS administration with a safe AI workflow where generated replies remain drafts until approved by a human.

The solution needs to support organisation-scoped users, operational dashboard metrics, structured conversation handling, grounded AI reply generation, and business-managed support content. Because these capabilities cut across authentication, persistence, admin UI, analytics, and AI orchestration, the implementation needs a coherent model rather than isolated CRUD features.

The preferred implementation stack for this MVP is Next.js for the application framework, PostgreSQL for persistence, Tailwind for UI styling, the OpenAI API for AI reply generation, an auth layer suitable for Next.js workspace access control, and Docker-based deployment.

## Goals / Non-Goals

**Goals:**
- Define an MVP architecture that supports multi-tenant organisations with role-based access.
- Structure the domain so conversations, knowledge articles, canned responses, AI generations, notes, and usage tracking can be implemented consistently.
- Ensure AI reply generation is grounded in approved business content and always human-reviewed before use.
- Support seeded demo data so the product is usable without third-party messaging integrations.
- Establish clear settings and analytics boundaries so future enhancements can extend from the MVP without changing the core model.
- Establish a consistent, modern dashboard visual system that supports both light and dark themes without redesigning core components later.

**Non-Goals:**
- Direct email, live chat, or social platform integrations in the MVP.
- Fully autonomous AI replies sent directly to customers.
- Advanced analytics such as sentiment analysis, forecasting, or cost attribution beyond baseline usage tracking.
- Enterprise features such as SSO, granular custom roles, or workflow automation rules.

## Decisions

### Use a Next.js, PostgreSQL, Tailwind, OpenAI, and Docker application stack
The product will be implemented as a Next.js application backed by PostgreSQL, styled with Tailwind, integrated with the OpenAI API for AI-assisted draft generation, and packaged for Docker deployment. This aligns the MVP with a common SaaS stack, keeps the application full-stack in one framework, and supports straightforward local demo and hosted deployment flows.

Alternative considered:
- Splitting the frontend and backend into separate services was rejected for the MVP because it increases setup and deployment complexity without adding meaningful portfolio value at this stage.

### Use a token-driven dashboard visual system with light and dark themes
The UI will use a neutral SaaS base with off-white or light grey backgrounds, white cards, subtle grey borders, dark grey text, and a single primary accent color of `#2596be` for interactive emphasis such as active navigation, buttons, links, focus rings, selected tabs, and charts. Semantic status colors will remain fixed by meaning, with blue for open, amber for pending, green for resolved, red for escalated, and purple for AI-draft states. Theme values will be defined through reusable CSS variables or equivalent design tokens so components consume semantic tokens rather than hardcoded colors, enabling future appearance settings with minimal refactoring.

Dark mode will be included in the MVP, with corresponding dark-surface tokens and preserved semantic status meaning across themes. The intended visual direction is clean and restrained, closer to Linear, Vercel, or Clerk than a saturated admin template, with careful whitespace, subtle borders, and minimal gradients.

Alternative considered:
- Hardcoding colors directly into components was rejected because it makes brand customization, dark mode, and consistent chart or status styling significantly harder to maintain.

### Use organisation-scoped tenancy with role-bound membership records
The system will model `organisations`, `users`, and `organisation_members` separately so a single user identity can belong to one or more workspaces over time while permissions remain organisation-specific. This keeps SaaS foundations realistic and allows RBAC checks to be enforced on every major record.

Alternative considered:
- Storing organisation and role directly on `users` was rejected because it limits future multi-workspace support and makes permission logic harder to evolve.

### Model conversations as channel-aware threads with separate messages and notes
Conversations will be stored as parent records with channel, status, assignment, timestamps, and summary metadata. Customer and agent communication will live in `messages`, while private agent-only commentary will live in `internal_notes`. Internal notes will be visible only to Admin and Support Agent members, while Viewers will be restricted to conversation and message history. This keeps public conversation state distinct from internal collaboration and gives AI generation a clear source dataset.

Alternative considered:
- Combining conversation messages and notes in one table with visibility flags was rejected because it increases query complexity and raises the risk of leaking internal content into customer-facing reply generation.

### Keep AI generation as an auditable draft artifact
Each generated draft will be recorded in `ai_reply_generations` with prompt inputs, selected supporting sources, fit/confidence signals, and approval outcome metadata. Approval outcomes will distinguish `generated`, `accepted_unchanged`, `edited_and_used`, and `rejected` so the MVP can report basic quality analytics. The system will present the generated text as a draft that agents can edit before saving or sending.

Alternative considered:
- Treating AI generation as ephemeral UI output was rejected because it removes traceability, prevents usage analytics, and makes it harder to explain why a draft was produced.

### Ground AI replies only on approved organisation content
The generation pipeline will pull from the active knowledge base, selected canned responses, conversation content, and organisation settings such as company name and tone. If the system cannot find enough support context, it will return a low-confidence warning and optionally suggest a knowledge gap rather than fabricating a definitive answer.

Alternative considered:
- Allowing unrestricted model responses was rejected because the product value depends on business-controlled accuracy and safe human review.

### Compute dashboard metrics from persisted operational events
Dashboard counts such as open conversations, resolved conversations, average response time, AI replies generated, knowledge base articles, and canned response usage will be derived from stored records and usage events. Monthly AI usage limits will be enforced by generation count in V1, while token and estimated cost data may still be stored for analytics when returned by the API. This avoids maintaining fragile hand-updated counters and keeps analytics aligned with real product behavior.

Alternative considered:
- Storing denormalized dashboard totals on organisation records was rejected for the MVP because it introduces synchronization risk before scale requires aggressive optimization.

### Use seeded multi-channel demo data instead of third-party ingestion
The MVP will support channel labels such as email, website, live chat, Facebook, and X as enum-like values on conversations, but data will be created manually or via seeds. This demonstrates realistic support operations without introducing fragile external API dependencies.

Alternative considered:
- Adding live channel integrations in V1 was rejected because it would dominate scope and distract from the internal product workflow.

## Risks / Trade-offs

- [AI grounding returns weak or empty results] -> Mitigate by surfacing low-confidence states, source lists, and knowledge-gap suggestions instead of forcing a polished draft.
- [Role boundaries leak privileged actions to viewers or non-admins] -> Mitigate with server-side authorization checks per capability and role-focused acceptance tests.
- [Dashboard metrics become expensive to compute] -> Mitigate by starting with indexed aggregate queries and leaving room for later materialized summaries if needed.
- [Seeded demo data drifts from product assumptions] -> Mitigate by defining stable seed scenarios that cover assignment, notes, AI drafts, KB usage, and resolved/open lifecycle states.
- [Settings sprawl complicates early implementation] -> Mitigate by limiting the MVP settings surface to the fields named in the proposal and deferring advanced policy controls.

## Migration Plan

1. Introduce the core schema for organisations, memberships, support records, support content, AI generations, and usage events.
2. Seed one or more demo organisations with representative users, conversations, articles, canned responses, and generation history.
3. Implement authentication and organisation-aware routing before enabling role-restricted screens.
4. Deliver CRUD and workflow features in the order defined by the change tasks so each screen can rely on stable underlying models.
5. Gate AI reply generation behind configured organisation settings and usage limits.
6. Validate dashboard metrics against seeded scenarios before treating them as production-ready analytics.
7. Add Docker packaging and runtime configuration for app, database connectivity, and deployment environment variables.
8. Apply the shared light/dark theme tokens across navigation, cards, forms, tables, status indicators, and charts before final UI verification.

Rollback strategy:
- Roll back by disabling the new routes and reverting the schema/data changes associated with the MVP if deployment fails before adoption.

## Open Questions

None for the current MVP definition.
