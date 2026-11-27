# Hero Typography Specification

## Requirements

### Requirement: Dynamic Engineering Statement Rotation
The Hero section SHALL replace the static line `"I build and test software."` with a continuous typewriter loop cycling through the 12 approved statements in configured order starting with `"Think. Build. Repeat."`.

#### Scenario: Initial render displays lead identity without hydration mismatch
- **WHEN** the homepage loads on server static HTML or client hydration
- **THEN** the primary `<h1>` remains `"Adrian Syah Abidin"`
- **AND** the first dynamic tagline `"Think. Build. Repeat."` is immediately visible without a blank flash or hydration mismatch

#### Scenario: Full typewriter timing cadence across phrases
- **WHEN** reduced-motion mode is inactive and animation is not paused
- **THEN** the initial completed phrase holds for `1500 ms`
- **AND** characters delete at `12 ms` per step (`10–15 ms` band), pause `90 ms` (`80–100 ms` band), and type the next phrase at `30 ms` per step (`25–35 ms` band)
- **AND** the cursor blinks at `480 ms` (`450–500 ms` half-period) using the `#65C8F5` accent token

### Requirement: Layout Stability & Responsive Integrity
The typewriter container MUST reserve space matching the longest phrase across viewports (`320px` through `1920px`) so typing, deleting, and wrapping never cause cumulative layout shift (`CLS = 0.00`) or horizontal overflow.

#### Scenario: Zero vertical shift during delete-to-type transition
- **WHEN** a phrase deletes down to zero visible characters before the next phrase starts
- **THEN** elements below the typewriter (body copy, `View My Work`, `Get in Touch`) retain fixed vertical position without shifting

### Requirement: Reduced Motion & Gesture Play/Pause Control
The typewriter component SHALL respect OS `prefers-reduced-motion` and application `qualityMode === "reduced"`, render zero standalone pause buttons next to the tagline, and toggle pause/resume when double-clicking the tagline text.

#### Scenario: Reduced motion disables looping timers
- **WHEN** `prefers-reduced-motion: reduce` is active OR `qualityMode === "reduced"` is selected
- **THEN** the headline displays `"Think. Build. Repeat."` statically with zero interval/timeout churn

#### Scenario: No standalone pause button clutter
- **WHEN** the Hero section renders in Desktop or Mobile viewports
- **THEN** no visible Pause/Play `<button>` appears next to the typewriter text

#### Scenario: User double-clicks tagline to pause and resume
- **WHEN** the user double-clicks the Hero tagline while animation is playing
- **THEN** the typewriter freezes on the current statement (`data-state="paused"`)
- **AND** double-clicking again resumes typing/deleting from the current position (`data-state="playing"`)
