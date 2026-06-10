## ADDED Requirements

### Requirement: Dashboard metrics overview
The system SHALL present an organisation-scoped dashboard overview with key support metrics relevant to the MVP.

#### Scenario: Dashboard loads summary metrics
- **WHEN** an authenticated user with workspace access opens the dashboard home
- **THEN** the system displays open conversations, resolved conversations, average response time, AI replies generated, knowledge base article count, and canned response usage

### Requirement: Metrics reflect organisation data only
The system SHALL scope dashboard analytics to the active organisation and exclude data from other workspaces.

#### Scenario: User belongs to one organisation
- **WHEN** the user views dashboard metrics
- **THEN** the system computes values only from records belonging to the active organisation

#### Scenario: Two organisations have different activity
- **WHEN** members from different organisations view their dashboard overview
- **THEN** each member sees metrics derived only from their own workspace data
