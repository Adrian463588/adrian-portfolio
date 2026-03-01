# Adrian Syah Abidin — Portfolio

A modern, interactive professional portfolio designed to showcase software engineering experience, projects, and skills. Built with Next.js and React Three Fiber, the site features a real-time 3D WebGL background and custom microinteractions to create a premium, engaging user experience tailored for hiring managers and technical recruiters.

🌐 **Live Demo:** [adriansyahabidin.vercel.app](https://adriansyahabidin.vercel.app)

---

## 🚀 Built With

* **Framework:** Next.js 16 (App Router, Turbopack)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Animations:** Framer Motion
* **3D Engine & Effects:** React Three Fiber, Three.js, @react-three/postprocessing
* **Icons & Fonts:** Lucide React, Google Fonts (Orbitron, Rajdhani)
* **Deployment:** Vercel

---

## 📂 Project Structure

```text
src/
├── app/                   # Next.js App Router (pages and layouts)
│   ├── layout.tsx         # Root layout (fonts, SEO, 3D scene)
│   ├── page.tsx           # Main single-page portfolio
│   ├── globals.css        # Tailwind v4 theme and global styles
│   ├── ThreeScene.tsx     # Dynamic import wrapper for 3D elements (SSR-safe)
│   └── ClientEffects.tsx  # Global client-side interactions (progress, spotlight)
├── components/            # Reusable UI components
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Content areas (Hero, Experience, Projects, Skills, etc.)
│   ├── three/             # R3F scene definition, camera rig, and geometries
│   └── ui/                # Microinteraction components (MagneticButton, TiltCard)
├── data/                  # Static content configuration
│   ├── experience.ts      # Professional history
│   ├── projects.ts        # Portfolio projects
│   ├── skills.ts          # Technical skill lists
│   └── ...                # Certifications, leadership, education
├── types/                 # TypeScript interfaces and type definitions
└── lib/                   # Shared utilities (e.g., classname merger)
```

---

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adrian463588/adrian-portfolio.git
   cd adrian-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📄 License

© 2026 Adrian Syah Abidin. All rights reserved.
