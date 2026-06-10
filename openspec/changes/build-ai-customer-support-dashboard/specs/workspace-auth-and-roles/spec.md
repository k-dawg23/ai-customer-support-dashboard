## ADDED Requirements

### Requirement: Organisation-scoped authentication and membership
The system SHALL support user registration and login for a support dashboard where each authenticated session is associated with an organisation workspace through a membership record.

#### Scenario: User signs in to a workspace
- **WHEN** a valid user authenticates and has an active organisation membership
- **THEN** the system grants access to that organisation's dashboard context

#### Scenario: User without membership is denied workspace access
- **WHEN** an authenticated user attempts to access an organisation where they do not have an active membership
- **THEN** the system denies access to organisation data and actions

### Requirement: Role-based access control for workspace actions
The system SHALL enforce organisation-scoped roles of Admin, Support Agent, and Viewer on all protected support dashboard capabilities.

#### Scenario: Admin accesses management features
- **WHEN** a user with the Admin role opens settings, knowledge base management, or canned response management
- **THEN** the system allows create, update, and delete actions permitted to admins

#### Scenario: Support Agent uses operational support tools
- **WHEN** a user with the Support Agent role accesses conversations and AI reply tools
- **THEN** the system allows operational workflow actions but denies admin-only configuration changes

#### Scenario: Viewer has read-only access
- **WHEN** a user with the Viewer role opens workspace content
- **THEN** the system allows read access and blocks mutation actions

#### Scenario: Viewer cannot access internal notes
- **WHEN** a user with the Viewer role opens a conversation that contains internal notes
- **THEN** the system shows conversation and message history without exposing internal note content
