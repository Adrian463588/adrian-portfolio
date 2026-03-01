# Adrian Syah Abidin — Portfolio

A modern, interactive portfolio built with Next.js, featuring a real-time 3D WebGL background, microinteractions, and professional hiring-oriented copy.

🌐 **Live:** [adriansyahabidin.vercel.app](https://adriansyahabidin.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| 3D Engine | React Three Fiber + Three.js |
| Post-Processing | @react-three/postprocessing (Bloom) |
| Icons | Lucide React |
| Fonts | Orbitron, Rajdhani (Google Fonts) |
| Deployment | Vercel |

## Features

- **Interactive 3D Scene** — WebGL background with bloom glow, particle mouse repulsion, icosahedron hover interaction, scroll-based camera depth, and shader-based ground grid
- **Microinteractions** — Magnetic buttons, tilt cards, cursor spotlight, scroll-spy nav indicator, character-stagger headings, badge reveals
- **Accessibility** — `prefers-reduced-motion` support, keyboard navigation, skip-link, `aria-current` on nav, focus-visible rings
- **Performance** — Dynamic imports for 3D scene, DPR capped at 1.5, no per-frame allocations, static page prerendering

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or pnpm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/Adrian463588/adrian-portfolio.git
cd adrian-portfolio

# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
src/
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Root layout (fonts, SEO, 3D scene)
│   ├── page.tsx           # Home page (all sections)
│   ├── globals.css        # Tailwind v4 theme + custom styles
│   ├── ThreeScene.tsx     # Dynamic import wrapper (SSR-safe)
│   └── ClientEffects.tsx  # ScrollProgress + CursorSpotlight
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Hero, Experience, Projects, Skills, etc.
│   ├── three/             # Scene.tsx (R3F 3D scene)
│   └── ui/                # MagneticButton, TiltCard, SectionHeading, etc.
├── data/                  # Static data (experience, projects, skills, etc.)
├── types/                 # TypeScript interfaces
└── lib/                   # Utilities (cn helper)
```

---

## Environment Variables

No environment variables are required. The project runs fully client-side with no external API keys.

---

## Troubleshooting

### `TypeError: Cannot read properties of undefined (reading 'array')`

**Cause:** The particle position buffer attribute was set in a `useEffect` (deferred), but `useFrame` ran on the first frame before the effect completed.

**Fix (already applied):** The position attribute is now set eagerly via a callback ref (`handleGeoRef`) when the `<bufferGeometry>` mounts, guaranteeing it exists before the first `useFrame` tick.

### 3D scene not visible

1. Ensure `@react-three/postprocessing` and `postprocessing` are installed
2. Check that `prefers-reduced-motion` is not enabled in your OS/browser settings (the 3D scene is hidden when reduced motion is preferred)
3. Try clearing the Next.js cache: `rm -rf .next && npm run dev`

### Hot reload breaks 3D scene

This is a known R3F limitation with HMR. Refresh the page after saving changes to `Scene.tsx`.

---

## Deployment (Vercel)

### Option A: Git Integration (Recommended)

1. Push your code to GitHub (see Git commands below)
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click **"Add New" → "Project"**
4. Import your GitHub repository (`Adrian463588/adrian-portfolio`)
5. Framework Preset: **Next.js** (auto-detected)
6. Click **"Deploy"**

Future pushes to `main` will auto-deploy.

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod
```

---

## Git Commands

```bash
# Stage all changes
git add .

# Commit
git commit -m "fix: remove GridHelper, fix particle TypeError, add README

- Replace GridHelper with shader-based GroundPlane
- Fix particle useFrame race condition via callback ref
- Add 4 new projects (TMDB QA, HSK 1 Vocab, PL/SQL Learn, Fortune Teller)
- Boost cursor spotlight visibility (500px/8% + trailing dot)
- Add README with tech stack, setup, troubleshooting, and deploy docs"

# Push to GitHub
git push origin main
```

---

## License

© 2025 Adrian Syah Abidin. All rights reserved.
