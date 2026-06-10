## 1. Foundation and data model

- [x] 1.1 Define the core schema for organisations, users, organisation memberships, conversations, messages, internal notes, knowledge base articles, canned responses, AI reply generations, settings, and usage events
- [x] 1.2 Add organisation-aware enums and constraints for roles, conversation statuses, support channels, article state, and AI generation outcomes
- [x] 1.3 Create seed/demo data covering at least one organisation, role-varied users, conversations in multiple statuses, KB articles, canned responses, and AI usage history

## 2. Authentication and workspace access

- [x] 2.1 Implement login and registration flows tied to organisation membership
- [x] 2.2 Enforce workspace-scoped authorization for Admin, Support Agent, and Viewer roles on server-side actions and protected routes
- [x] 2.3 Add organisation context loading and access denial handling for users without valid membership

## 3. Support operations workspace

- [x] 3.1 Build the main dashboard shell and navigation for dashboard, conversations, knowledge base, canned responses, and settings
- [x] 3.2 Implement the shared dashboard theme foundation with CSS variables or design tokens for surfaces, text, borders, primary accent, and semantic status colors
- [x] 3.3 Implement light and dark mode support across navigation, layout, cards, forms, tables, and chart surfaces
- [x] 3.4 Implement the dashboard overview cards for open conversations, resolved conversations, average response time, AI replies generated, knowledge base article count, and canned response usage
- [x] 3.5 Apply semantic status styling for conversation states and AI-related indicators across dashboard views
- [x] 3.6 Ensure charts, buttons, links, tabs, and focus states consistently use the shared primary accent system
- [x] 3.7 Implement conversation listing with organisation scoping and filters for Open, Pending, and Resolved states
- [x] 3.8 Implement conversation detail workflows for assignment, internal notes, editable drafts, and resolution updates

## 4. Business-managed support content

- [x] 4.1 Implement admin CRUD flows for knowledge base articles with category and active or inactive state
- [x] 4.2 Implement admin CRUD flows for canned responses with title, category, and response text
- [x] 4.3 Implement canned response insertion into the reply composer and record usage events for analytics

## 5. AI assistance and settings

- [x] 5.1 Implement organisation support settings for company name, tone, default AI model, monthly usage limit, business hours, and escalation message
- [x] 5.2 Build the AI draft generation pipeline using conversation content, active knowledge base sources, optional canned response context, and organisation settings
- [x] 5.3 Persist AI generation records with draft content, confidence or fit metadata, sources used, and human-review status
- [x] 5.4 Enforce or warn on monthly AI usage limits and surface low-confidence or knowledge-gap outcomes when support context is insufficient

## 6. Verification and polish

- [x] 6.1 Add role-based and organisation-scoped tests for protected actions and data visibility
- [x] 6.2 Add workflow tests for conversation management, knowledge base management, canned response insertion, and AI draft review behavior
- [x] 6.3 Validate seeded demo scenarios and dashboard metrics against expected organisation-specific outcomes
- [x] 6.4 Verify light mode, dark mode, and responsive dashboard layouts are visually consistent with the approved design system
