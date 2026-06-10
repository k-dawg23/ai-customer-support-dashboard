## ADDED Requirements

### Requirement: Canned response management
The system SHALL allow admin users to create, edit, and delete canned responses with title, category, and response text.

#### Scenario: Admin creates a canned response
- **WHEN** an admin submits a valid canned response title, category, and body text
- **THEN** the system stores the canned response for the active organisation

#### Scenario: Admin updates a canned response
- **WHEN** an admin edits an existing canned response
- **THEN** the system saves the updated canned response details

#### Scenario: Admin deletes a canned response
- **WHEN** an admin deletes an existing canned response
- **THEN** the system removes the canned response from active management views

### Requirement: Canned response insertion and usage tracking
The system SHALL allow authorised support users to insert a canned response into a conversation draft and track usage count.

#### Scenario: Agent inserts a canned response
- **WHEN** an authorised user selects a canned response while composing a reply
- **THEN** the system inserts the canned response text into the reply draft

#### Scenario: Canned response usage is recorded
- **WHEN** a canned response is inserted into a reply workflow
- **THEN** the system increments or records usage for that canned response in organisation analytics
