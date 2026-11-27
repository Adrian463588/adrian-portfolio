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

### Requirement: Reduced Motion & Screen Reader Accessibility
The typewriter component SHALL respect OS `prefers-reduced-motion`, application `qualityMode === "reduced"`, provide a keyboard-accessible Pause/Resume control, and avoid letter-by-letter screen reader announcements.

#### Scenario: Reduced motion disables looping timers
- **WHEN** `prefers-reduced-motion: reduce` is active OR `qualityMode === "reduced"` is selected
- **THEN** the headline displays `"Think. Build. Repeat."` statically with zero interval/timeout churn

#### Scenario: User pauses and resumes animation
- **WHEN** the user activates the Hero tagline Pause control via pointer or keyboard
- **THEN** typing/deleting pauses cleanly on the current statement (`aria-pressed="true"`) until resumed
