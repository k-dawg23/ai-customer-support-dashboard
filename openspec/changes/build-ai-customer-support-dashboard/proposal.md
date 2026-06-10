## Why

Small businesses need a practical internal support system that improves reply speed without handing full customer communication autonomy to AI. Building an AI-assisted dashboard now creates a realistic SaaS foundation that demonstrates multi-user administration, support workflows, business-controlled knowledge grounding, and human-reviewed AI output in one coherent product.

## What Changes

- Add a multi-tenant support dashboard with organisation workspaces, user membership, and role-based access for admins, support agents, and viewers.
- Add conversation management for viewing, filtering, assignment, internal notes, draft replies, and resolution tracking across seeded multi-channel support tickets.
- Add a dashboard overview showing operational metrics such as open and resolved conversations, response time, AI draft usage, knowledge base coverage, and canned response usage.
- Add knowledge base management for FAQ and support articles with categories, active state, and AI grounding support.
- Add canned response management so agents can insert reusable replies and track usage frequency.
- Add AI draft generation that uses conversation context, approved knowledge base content, configurable tone, business metadata, and optional canned responses to produce a human-review draft with source attribution and confidence signals.
- Add settings for company support preferences including company name, support tone, AI model choice, monthly usage limits, business hours, and escalation copy.
- Add a reusable dashboard visual system with neutral surfaces, a single primary accent color, fixed semantic status colors, CSS theme variables, and dark mode support.
- Add seed/demo data and usage tracking needed to make the MVP usable for demos and portfolio review.

## Capabilities

### New Capabilities
- `workspace-auth-and-roles`: Organisation-scoped authentication, membership, and role permissions for admins, agents, and viewers.
- `support-dashboard-overview`: Dashboard metrics and summary views for support operations and AI usage.
- `conversation-management`: Conversation lifecycle management, filtering, assignment, notes, draft replies, and resolution workflows.
- `knowledge-base-management`: CRUD management for support knowledge articles, categories, and activation state for AI grounding.
- `canned-response-management`: CRUD management and usage tracking for reusable support response templates.
- `ai-reply-assistance`: Human-reviewed AI reply draft generation with knowledge grounding, confidence signals, and knowledge-gap warnings.
- `support-settings-and-usage-controls`: Organisation-level support settings, AI usage limits, and operational preferences.
- `dashboard-theming-and-visual-system`: Shared dashboard styling, semantic color tokens, and light/dark theme behavior for the MVP UI.

### Modified Capabilities

None.

## Impact

- Affects application architecture across authentication, authorization, dashboard UI, conversation workflows, AI orchestration, admin settings, and theme/token management.
- Introduces core data models for organisations, members, conversations, messages, internal notes, knowledge articles, canned responses, AI generations, and usage events.
- Requires integration points for authentication, persistence, seeded demo data, analytics aggregation, and LLM-backed draft generation.
- Establishes the product’s MVP scope and spec baseline for later implementation and portfolio extensions such as audit logs, sentiment, or external channel integrations.
