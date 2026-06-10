## ADDED Requirements

### Requirement: Grounded AI reply draft generation
The system SHALL allow authorised support users to generate an AI-assisted reply draft for a selected conversation using business-controlled organisation data.

#### Scenario: Agent generates a reply draft
- **WHEN** an authorised user requests a suggested reply for a conversation
- **THEN** the system generates a draft using the customer message, active knowledge base context, organisation tone settings, business name, and any selected canned response context

### Requirement: Draft output includes confidence and source support
The system SHALL return source-aware generation metadata with each AI draft so the human reviewer can assess fit before use.

#### Scenario: Draft returns supporting metadata
- **WHEN** the system produces an AI draft
- **THEN** the response includes the draft text, a confidence or fit indicator, and the knowledge base sources used

### Requirement: Low-context warnings and knowledge-gap signaling
The system SHALL warn the user when grounded support context is insufficient and indicate that the knowledge base may need expansion.

#### Scenario: Not enough information exists
- **WHEN** the system cannot find enough approved knowledge to answer the customer confidently
- **THEN** the system flags the result as low confidence and warns that suitable support information may be missing

### Requirement: Human approval before customer use
The system SHALL treat all generated AI replies as drafts that require human review before they are saved as a final response or used in customer communication.

#### Scenario: Agent reviews AI output before use
- **WHEN** an AI draft is generated
- **THEN** the system requires a human user to review or edit the text before it is treated as final reply content

### Requirement: AI draft approval outcomes are tracked
The system SHALL record an approval outcome for each AI draft using distinct states for generated, accepted unchanged, edited and used, or rejected.

#### Scenario: Agent accepts draft without changes
- **WHEN** a user uses an AI draft without editing its content
- **THEN** the system records the draft outcome as accepted unchanged

#### Scenario: Agent edits draft before use
- **WHEN** a user modifies an AI draft and then uses it in the support workflow
- **THEN** the system records the draft outcome as edited and used

#### Scenario: Agent rejects draft
- **WHEN** a user discards an AI draft instead of using it
- **THEN** the system records the draft outcome as rejected
