## ADDED Requirements

### Requirement: Organisation support settings management
The system SHALL allow admin users to manage organisation-level support settings used by dashboard workflows and AI reply generation.

#### Scenario: Admin updates support settings
- **WHEN** an admin saves company name, support tone, default AI model, monthly AI usage limit, business hours, or escalation message
- **THEN** the system stores those settings for the active organisation

### Requirement: Settings inform AI assistance behavior
The system SHALL apply relevant organisation settings during AI reply assistance workflows.

#### Scenario: Tone and business name influence AI draft generation
- **WHEN** an AI draft is generated for an organisation with saved support settings
- **THEN** the system includes the configured company identity and tone preference in the generation inputs

### Requirement: Monthly AI usage limits are enforceable
The system SHALL track AI assistance usage events for each organisation so configured monthly usage limits can be enforced by generation count in the first implementation.

#### Scenario: Usage event is recorded for a generation
- **WHEN** the system completes an AI reply generation attempt
- **THEN** the system records a usage event associated with the active organisation

#### Scenario: Usage limit is reached
- **WHEN** an organisation has reached its configured monthly AI usage limit
- **THEN** the system prevents or clearly warns about additional AI generation attempts according to the configured policy

#### Scenario: Analytics store supplemental usage metadata
- **WHEN** the AI provider returns token or cost-related metadata for a generation attempt
- **THEN** the system may store that metadata for analytics without using it as the primary V1 limit enforcement rule
