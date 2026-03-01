import { ProjectEntry } from "@/types";

export const projects: ProjectEntry[] = [
  {
    title: "TMDB API QA Automation",
    subtitle: "QA Engineering — BDD Automation Suite",
    problem:
      "TMDB's critical authentication and favorites flows lacked automated regression coverage.",
    solution:
      "Built an end-to-end BDD test suite with Cypress and Cucumber, covering key user flows. Identified 5 critical bugs through structured automated scenarios.",
    stack: ["Cypress", "Cucumber (BDD)", "Node.js", "Git"],
    role: "QA Engineer",
    repoUrl: "https://github.com/Adrian463588/TMDB-QA-Testing",
  },
  {
    title: "HSK 1 Vocabulary Master",
    subtitle: "Interactive Learning App — \"Ink & Paper\" Edition",
    problem:
      "Mandarin learners needed a fast, focused tool for drilling 250+ HSK 1 vocabulary words.",
    solution:
      "Built an interactive web app with search, flashcards, and smooth 3D animations. Minimalist UI, performance-optimized with lazy loading and debounced input. Follows Atomic Design principles.",
    stack: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion"],
    role: "Solo Developer",
    liveUrl: "https://hsk1vocab.edgeone.dev",
    repoUrl: "https://github.com/Adrian463588/hsk1vocab",
  },
  {
    title: "PL/SQL Learn",
    subtitle: "Oracle PL/SQL Learning Platform",
    problem:
      "Students needed an accessible, offline-capable platform for practicing Oracle PL/SQL beyond the classroom.",
    solution:
      "Created an interactive platform with 289+ practice questions, an integrated code editor, achievements, and a progress dashboard. Fully localStorage-based — no database required.",
    stack: ["Next.js", "React", "Tailwind CSS", "Recharts", "CodeMirror"],
    role: "Solo Developer",
    liveUrl: "https://plsqllearn.edgeone.dev",
    repoUrl: "https://github.com/Adrian463588/plsqllearn",
  },
  {
    title: "Mystical Fortune Teller",
    subtitle: "Multi-System Divination Engine",
    problem:
      "No single tool combined multiple fortune-telling systems (Zodiac, Shio, BaZi, Primbon, Feng Shui) in a cohesive experience.",
    solution:
      "Built a divination engine unifying five systems with deterministic algorithms (seeded RNG), a Match & Marry analysis feature, and a database-less architecture.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    role: "Solo Developer",
    liveUrl: "https://fortuneteller.edgeone.dev",
    repoUrl: "https://github.com/Adrian463588/FortuneTeller-",
  },
  {
    title: "Wrath of the Disasters",
    subtitle: "3D Game — Academic Capstone",
    problem:
      "Needed to demonstrate advanced OOP and game development skills for an academic capstone.",
    solution:
      "Led game programming for a 3D Unreal Engine project: implemented core mechanics, input systems, character movement, and physics-based collision detection.",
    stack: ["C#", "Unreal Engine", "Git"],
    role: "Lead Game Programmer",
    repoUrl: "https://github.com/Adrian463588/ProjectGame",
  },
  {
    title: "Golang RESTful API",
    subtitle: "Backend Bootcamp Capstone",
    problem:
      "Build a production-grade API service as part of the Golang backend bootcamp.",
    solution:
      "Designed and deployed a RESTful API handling JSON requests/responses, middleware, server logic, and PostgreSQL integration using the Gin framework.",
    stack: ["Go (Gin)", "PostgreSQL", "REST"],
    role: "Sole Developer",
    repoUrl:
      "https://github.com/Adrian463588/finalproject-sb-go-70-Adrian.git",
  },
  {
    title: "Portfolio Website",
    subtitle: "Personal Project — This Site",
    problem:
      "Needed a professional portfolio to showcase skills and experience for hiring.",
    solution:
      "Built a Next.js portfolio with TypeScript, Tailwind CSS, Framer Motion animations, and a React Three Fiber 3D scene with interactive microinteractions.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "React Three Fiber",
    ],
    role: "Designer & Developer",
    liveUrl: "https://adriansyahabidin.vercel.app/",
  },
];
