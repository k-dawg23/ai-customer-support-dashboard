## ADDED Requirements

### Requirement: Conversation list and status filtering
The system SHALL allow support users to browse customer conversations and filter them by lifecycle status.

#### Scenario: Agent filters open conversations
- **WHEN** a support user filters the conversation list to Open
- **THEN** the system shows only conversations whose status is Open

#### Scenario: Agent filters pending conversations
- **WHEN** a support user filters the conversation list to Pending
- **THEN** the system shows only conversations whose status is Pending

#### Scenario: Agent filters resolved conversations
- **WHEN** a support user filters the conversation list to Resolved
- **THEN** the system shows only conversations whose status is Resolved

### Requirement: Conversation assignment workflow
The system SHALL allow authorised support users to assign conversations to workspace agents.

#### Scenario: Agent assigns a conversation
- **WHEN** an authorised user selects a workspace agent for an unassigned or reassigned conversation
- **THEN** the system stores the assignee and shows the updated assignment in conversation views

### Requirement: Internal collaboration notes
The system SHALL allow Admin and Support Agent users to add and view internal notes that are hidden from Viewers and not included in customer-facing replies.

#### Scenario: Agent adds an internal note
- **WHEN** an authorised user submits an internal note on a conversation
- **THEN** the system saves the note as internal-only content associated with that conversation

#### Scenario: Viewer does not see internal notes
- **WHEN** a Viewer opens a conversation that has internal notes
- **THEN** the system does not display those internal notes in the conversation view

### Requirement: Draft reply editing workflow
The system SHALL allow authorised support users to create, edit, and save a draft reply for a conversation before it is treated as final output.

#### Scenario: Agent edits a generated or manual draft
- **WHEN** an authorised user changes the reply text in the conversation composer
- **THEN** the system preserves the edited draft for review or later use

### Requirement: Conversation resolution lifecycle
The system SHALL allow authorised support users to mark conversations as resolved after handling them.

#### Scenario: Agent resolves a conversation
- **WHEN** an authorised user marks a conversation as resolved
- **THEN** the system updates the conversation status to Resolved and reflects the change in filtered views and dashboard metrics
