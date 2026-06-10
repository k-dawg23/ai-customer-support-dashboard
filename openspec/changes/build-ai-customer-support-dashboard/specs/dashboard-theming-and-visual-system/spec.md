## ADDED Requirements

### Requirement: Neutral dashboard visual foundation
The system SHALL present the dashboard UI with a neutral professional base that keeps attention on operational data.

#### Scenario: Light theme uses neutral surfaces
- **WHEN** a user views the dashboard in light mode
- **THEN** the interface uses a light grey or off-white background, white card surfaces, subtle grey borders, and dark grey text

### Requirement: Shared primary accent color
The system SHALL use a single primary accent color of `#2596be` for interactive emphasis across the MVP dashboard.

#### Scenario: Primary actions and navigation use the accent color
- **WHEN** a user views primary buttons, active navigation items, links, focus rings, selected tabs, or chart highlights
- **THEN** the system styles those elements using the primary accent color or its theme-safe variants

### Requirement: Fixed semantic status colors
The system SHALL preserve consistent semantic colors for operational statuses independent of the primary brand accent.

#### Scenario: Conversation and AI statuses use fixed semantics
- **WHEN** the interface displays status indicators for Open, Pending, Resolved, Escalated, or AI Draft Generated
- **THEN** the system uses blue for Open, amber for Pending, green for Resolved, red for Escalated, and purple for AI Draft Generated

### Requirement: Theme tokens support future customization
The system SHALL define reusable theme variables or design tokens for primary, semantic, surface, border, and text colors instead of hardcoding values directly into components.

#### Scenario: Component styling consumes shared theme tokens
- **WHEN** dashboard components render across pages
- **THEN** the system applies shared theme tokens for colors so future appearance customization can be introduced without redesigning components

### Requirement: Dark mode support
The system SHALL support both light and dark dashboard themes for the MVP.

#### Scenario: User switches to dark mode
- **WHEN** a user views the dashboard in dark mode
- **THEN** the system renders dark-appropriate background, surface, border, and text tokens while preserving readable contrast and semantic status meaning
