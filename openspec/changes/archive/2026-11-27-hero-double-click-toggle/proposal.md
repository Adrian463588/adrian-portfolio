# Change: hero-double-click-toggle

## Why
The circular Pause/Play button beside the rotating Hero tagline competes visually with the 3D glass torus knot. Removing the button restores pure editorial simplicity while keeping play/pause control available via direct double-click on the tagline text.

## What Changes
- Remove the rendered Pause/Play `<button>` UI and Lucide icon imports from `TypewriterText.tsx`.
- Toggle `isPaused` via `onDoubleClick` directly on the Hero tagline `<p>` element and expose semantic `data-state` (`"playing" | "paused" | "reduced"`).
- Restore full container width (`max-w-full`) cleanly without reserving button space.
