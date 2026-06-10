## ADDED Requirements

### Requirement: Knowledge base article management
The system SHALL allow admin users to create, edit, and delete knowledge base or FAQ articles for an organisation.

#### Scenario: Admin creates an article
- **WHEN** an admin submits a valid article title and body
- **THEN** the system stores a new knowledge base article for the active organisation

#### Scenario: Admin updates an article
- **WHEN** an admin edits an existing article
- **THEN** the system saves the revised article content

#### Scenario: Admin deletes an article
- **WHEN** an admin deletes an existing article
- **THEN** the system removes the article from active management views

### Requirement: Article categorisation and activation state
The system SHALL support category assignment and active or inactive state on knowledge base articles.

#### Scenario: Admin categorises an article
- **WHEN** an admin selects a category for an article
- **THEN** the system stores the category with that article

#### Scenario: Admin deactivates an article
- **WHEN** an admin marks an article as inactive
- **THEN** the system excludes that article from active AI grounding results while preserving it for management
