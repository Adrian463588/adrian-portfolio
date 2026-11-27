# Hero Typography Specification

## MODIFIED Requirements

### Requirement: Reduced Motion & Gesture Play/Pause Control
The typewriter component SHALL respect OS `prefers-reduced-motion` and application `qualityMode === "reduced"`, render zero external control buttons next to the tagline, and allow interactive pause/resume by double-clicking the tagline text.

#### Scenario: No standalone pause button clutter
- **WHEN** the Hero section renders in Desktop or Mobile viewports
- **THEN** no visible Pause/Play `<button>` appears next to the typewriter text

#### Scenario: User double-clicks tagline to pause and resume
- **WHEN** the user double-clicks the Hero tagline while animation is playing
- **THEN** the typewriter freezes on the current text (`data-state="paused"`)
- **AND** double-clicking again resumes typing/deleting from the current position (`data-state="playing"`)
