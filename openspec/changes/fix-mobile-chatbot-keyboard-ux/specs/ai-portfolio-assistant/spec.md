## ADDED Requirements

### Requirement: Intentional composer focus and adaptive viewport

Ask Adrian SHALL keep the composer inside the visible viewport and accept text only after deliberate focus on touch-capable devices.

#### Scenario: Open with touch or a hardware keyboard on a touch-capable device

- **WHEN** the visitor activates the launcher
- **THEN** focus moves to Close and the software keyboard stays closed
- **AND** the greeting and three suggestions are visible at ordinary portrait sizes for a new conversation
- **AND** tapping the composer or navigating to it with a keyboard focuses it

#### Scenario: Open on a non-touch desktop

- **WHEN** the visitor activates the launcher with a mouse or keyboard
- **THEN** the floating panel retains immediate typing focus

#### Scenario: The visible viewport changes

- **WHEN** the keyboard appears, the browser pans, the device rotates, or the keyboard is dismissed
- **THEN** the panel follows the visible viewport without an animated resize
- **AND** the header, Close button, composer, and send control stay visible while the conversation and settings can scroll
- **AND** scrolling the chat does not scroll the page behind it

#### Scenario: Close the chat

- **WHEN** the visitor activates Close or presses Escape
- **THEN** the composer loses focus, the existing closing animation runs, and focus returns to the launcher without scrolling the page
- **AND** reopening follows the same focus rules and restores the existing session history
