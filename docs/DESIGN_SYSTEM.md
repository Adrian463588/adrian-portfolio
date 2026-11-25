# Design System — Graphite & Ice Blue

## 1. Visual Philosophy
Understated Swiss-editorial engineering dark mode: crisp hierarchy, generous spacing, high contrast, zero neon blur/glow clutter, zero decorative eyebrow badges or generic AI gradients.

## 2. Color Tokens (WCAG 2.2 AA Verified)
| Token | Hex | Role | Contrast vs `#09090B` / `#18181B` |
|---|---|---|---|
| `--bg-canvas` | `#09090B` | Primary page background | — |
| `--bg-surface` | `#18181B` | Card, navbar, input surface | — |
| `--bg-surface-elevated` | `#202024` | Hover / nested control surface | — |
| `--border-subtle` | `#27272A` | Structural hairlines & card borders | — |
| `--border-strong` | `#3F3F46` | Focus / interactive active border | — |
| `--text-primary` | `#F4F4F5` | Headings & primary copy | `18.1:1` on `#09090B` |
| `--text-secondary` | `#A1A1AA` | Body descriptions & metadata | `7.9:1` on `#09090B`, `6.4:1` on `#18181B` |
| `--text-muted` | `#8E8E98` | Tertiary captions (minimum >= 4.5:1) | `6.1:1` on `#09090B`, `4.9:1` on `#18181B` |
| `--accent` | `#38BDF8` | Ice Blue interactive highlights & focus | `9.6:1` on `#09090B` |
| `--accent-contrast` | `#09090B` | Text on solid `#38BDF8` / `#F4F4F5` CTAs | `9.6:1` / `18.1:1` |
| `--status-success` | `#34D399` | Verified CI / release / pass indicator | `10.9:1` on `#09090B` |

> Note: Never use `text-zinc-500` (`#71717A`, `~3.8:1` on `#18181B`) for readable small text; floor secondary/muted text at `#A1A1AA` (`zinc-400`) or `#B4B4BE`.

## 3. Typography
- **Sans (`--font-sans`):** `Geist` (`next/font/google`), fallback `Inter, system-ui, sans-serif`
- **Mono (`--font-mono`):** `Geist_Mono` (`next/font/google`), fallback `ui-monospace, monospace`
- **Scale:**
  - Hero `h1`: `clamp(2.25rem, 4.2vw, 3.75rem)`, `font-weight: 700`, `line-height: 1.08`, `letter-spacing: -0.03em` (max 2 lines on desktop)
  - Section `h2`: `clamp(1.75rem, 2.8vw, 2.25rem)`, `font-weight: 600`, `letter-spacing: -0.02em`
  - Card `h3`: `1.125rem–1.25rem`, `font-weight: 600`
  - Body: `1rem` (`16px`), `line-height: 1.65`, measure `60–72ch`
  - Metadata / Code: `0.75rem–0.8125rem` (`12px–13px`) in `--font-mono`

## 4. Layout, Spacing & Radii
- **Max Content Width:** `1200px` (`max-w-[1200px]` / `75rem`) with `1.5rem` (`24px`) horizontal gutter
- **Spacing Scale:** `4 / 8 / 16 / 24 / 32 / 48 / 64 / 96` px
- **Border Radius:** `8px` (buttons/inputs/tags), `12px` (cards), `16px` (featured panels/modals)
- **Glassmorphism:** Strictly limited to floating navbar and subtle modal/panel overlays (`bg-[#09090B]/80 backdrop-blur-md border-zinc-800`).

## 5. Motion & 3D Rules
- Microinteractions: `150ms–220ms` cubic-bezier / opacity & transform only.
- **No `opacity: 0` scroll gates** on critical text/sections.
- CSS 3D card tilt (`<= 5°` rotateX/Y, `perspective: 900px`) disabled on `(hover: none)` / touch devices and `prefers-reduced-motion: reduce`.
- Hero 3D canvas: bounded container (`aspect-square` / `440px` desktop), procedural geometry, `frameloop="demand"`, pauses when offscreen or `document.hidden`, WebGL failure ErrorBoundary + clean SVG/CSS architectural fallback.
- V2 Enterprise patterns: grouped multi-role Experience Card (`#18181B` card with nested `#09090B` role timeline rows), restrained typography-first Enterprise Case Study header + conceptual workflow block (explicitly labeled illustrative when no client screenshots exist), zero broken link placeholders.
