# 🪐 Orion Space

> An interactive 3D solar system explorer — explore all 8 planets, watch live orbital mechanics, journey through space history, and test your cosmic knowledge.

🌐 **Live Demo:** [orion-space.vercel.app](orion-space-phi.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🪐 **3D Planets** | Every planet rendered in interactive WebGL. Drag to rotate, zoom to explore. |
| ☀️ **Live Orrery** | All 8 planets orbiting the Sun in real time with accurate relative speeds. |
| 📜 **Space Timeline** | 50+ milestones from Sputnik (1957) to Starship (2024), filterable by category. |
| 🧠 **Space Quiz** | 50-question bank with timer, difficulty filter, category breakdown, and confetti. |
| 🌟 **Cinematic UI** | WebGL star field, cursor glow, scroll animations, magnetic navbar, page transitions. |

---

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** — App Router, server components, static generation
- **[Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** — 3D WebGL rendering
- **[@react-three/drei](https://github.com/pmndrs/drei)** — OrbitControls, Html overlays, instanced meshes
- **[Motion](https://motion.dev/)** — Page transitions, scroll animations, layout animations
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[TypeScript](https://www.typescriptlang.org/)** — Full type safety throughout

---

## 📁 Project Structure

```
orion-space/
├── app/
│   ├── page.tsx              # Homepage — hero, stats, planet grid, feature bento
│   ├── layout.tsx            # Root layout — navbar, footer, star field, fonts
│   ├── template.tsx          # Page transition wrapper (opacity fade)
│   ├── globals.css           # Global styles and keyframe animations
│   ├── planets/
│   │   ├── page.tsx          # Planet browser with search & filter
│   │   └── [slug]/page.tsx   # Individual planet detail page (SSG)
│   ├── orrery/page.tsx       # Live 3D solar system orrery
│   ├── timeline/page.tsx     # Space exploration history timeline
│   ├── quiz/page.tsx         # Interactive space knowledge quiz
│   ├── not-found.tsx         # 404 — "Lost in Space"
│   └── error.tsx             # Error boundary — "Cosmic Anomaly"
│
├── components/
│   ├── layout/
│   │   ├── navbar.tsx        # Fixed navbar with magnetic links & sliding underline
│   │   └── footer.tsx        # Footer with planet marquee & social links
│   ├── ui/
│   │   ├── planet-3d.tsx     # Reusable 3D planet WebGL component
│   │   ├── planet-card.tsx   # Tilt card with tooltip (diameter, distance)
│   │   ├── planet-detail.tsx # Full planet detail with size comparison & moons
│   │   ├── hero-section.tsx  # Animated hero with canvas star field
│   │   ├── stars-bg.tsx      # Fixed WebGL star field background
│   │   ├── cursor-glow.tsx   # Mouse-tracking radial glow
│   │   ├── spotlight.tsx     # Mouse-tracking spotlight for hero
│   │   ├── stats-bar.tsx     # Animated count-up stats (8 planets, 4.6B years…)
│   │   ├── glowing-button.tsx# Pulsing CTA button with shimmer
│   │   ├── tooltip.tsx       # Dark glassmorphism tooltip
│   │   ├── timeline-client.tsx# Scroll-driven timeline with filter tabs
│   │   └── planets-client.tsx # Planet grid with search & category filter
│   ├── sections/
│   │   └── feature-bento.tsx # "Why Orion Space?" bento grid
│   ├── quiz/
│   │   ├── quiz-game.tsx     # Quiz controller — 3 screens, timer, shuffle
│   │   ├── quiz-card.tsx     # Answer option button with shake/correct animation
│   │   ├── quiz-progress.tsx # Progress bar + circular countdown timer
│   │   └── quiz-result.tsx   # Score circle, category breakdown, confetti
│   ├── hero/
│   │   └── hero-scene.tsx    # Three.js Earth hero scene
│   └── orrery/
│       ├── solar-system.tsx  # Full orrery — planets, moons, asteroid belt, trails
│       └── orrery-client.tsx # Orrery page client shell with speed/pause controls
│
└── lib/
    ├── planets.ts            # Planet data — all 8 planets with stats & colors
    ├── timeline.ts           # 50+ space exploration events with categories
    └── quiz.ts               # 50 questions across planets, stars, history, missions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abood170/orion-space.git
cd orion-space

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build   # Creates an optimised production build
npm run start   # Serves the production build locally
```

---

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero, animated stats, planet grid, and feature overview |
| `/planets` | Searchable, filterable grid of all 8 planets |
| `/planets/[slug]` | Individual planet — 3D viewer, stats, moons, size comparison |
| `/orrery` | Live 3D orrery with speed control, pause, and camera reset |
| `/timeline` | Scrollable space history timeline filterable by mission category |
| `/quiz` | 20-question quiz session drawn from a 50-question bank |

---

## 🎨 Design System

- **Background:** `#0a0a0f` — near-black with a blue tint
- **Accent:** `#3b82f6` (blue-500) → `#8b5cf6` (purple-500) gradient
- **Typography:** Inter (variable font, `display: swap`)
- **Motion:** Opacity + transform only — no layout-triggering animations
- **3D:** WebGL canvases are lazy-loaded with `ssr: false` to prevent hydration issues

---

## 👤 Author

**Abdallah Odeh**

- GitHub: [@Abood170](https://github.com/Abood170)
- LinkedIn: [abdallah-odeh](https://www.linkedin.com/in/abdallah-odeh-52bb62276/)

---

## 📄 License

[MIT](LICENSE) — free to use, modify, and distribute.
