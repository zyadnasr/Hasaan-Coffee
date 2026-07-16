# Architecture Review — Hassan Coffee Website

## 1. Project Structure

```
Hasaan-Coffee/
├── .env.local                    # Environment variables (GEMINI_API_KEY, APP_URL)
├── .github/workflows/static.yml  # GitHub Pages deployment
├── .gitignore                    # Standard ignores
├── assets/.aistudio/             # AI Studio artifact (empty via .gitignore)
├── index.html                    # SPA entry point
├── metadata.json                 # AI Studio metadata
├── package.json                  # Dependencies & scripts
├── README.md                     # Minimal readme
├── src/
│   ├── main.tsx                  # React root mount
│   ├── index.css                 # Global styles + Tailwind theme
│   ├── App.tsx                   # Root component (routing, layout, scroll transforms)
│   ├── assets/images/            # Static images (hero, logo)
│   ├── components/               # 14 React components (one per section)
│   ├── data/                     # Static data files (config, services, stats, testimonials)
│   ├── hooks/                    # Custom hooks (useOrderCalculator)
│   └── utils/                    # Utilities (analytics.ts)
├── tsconfig.json
└── vite.config.ts
```

## 2. Rendering Flow

1. `index.html` loads `src/main.tsx`
2. `main.tsx` mounts `<App />` inside `<StrictMode>` into `#root`
3. `App.tsx` checks URL path for 404 handling (no router library)
4. If valid path: renders `Preloader` → `Header` → `Hero` → lazy-loaded sections
5. Below-the-fold sections use `React.lazy()` with `Suspense` fallback
6. Scroll-linked animations computed at `App` level and passed as props

## 3. Routing Flow

- **No router library** — routing is handled manually via `window.location.pathname`
- `App.tsx:58-60` checks if path is `/` or `/Hasaan-Coffee/`
- Any other path renders `<NotFound />`
- **Severity: Medium** — This is a single-page site so a router isn't strictly needed, but the manual approach is fragile

### Issues Found

| Issue | File | Line | Severity |
|-------|------|------|----------|
| No 404 handling for sub-routes like `/Hasaan-Coffee/some-path` | `App.tsx` | 59 | Medium |
| 404 check only validates exact paths, not prefixes | `App.tsx` | 59 | Medium |
| No hash-based or history-based routing | `App.tsx` | — | Low |

## 4. State Management

- **No global state library** (Redux, Zustand, etc.)
- State is managed via:
  - `useState` in `App.tsx` for UI state (preloading, 404, exit popup)
  - `useOrderCalculator` hook for calculator state
  - `useScroll` / `useTransform` from Motion for scroll-derived values
  - Props drilling for whatsapp number and scroll values

### Issues Found

| Issue | File | Line | Severity |
|-------|------|------|----------|
| Scroll transforms computed in App, passed through 2+ levels to Hero | `App.tsx` | 22-27, `Hero.tsx` | Medium |
| WhatsApp number passed as prop through multiple components | `App.tsx` | 86-138 | Low |
| No React Context for shared values (whatsapp number, config) | `App.tsx` | — | Medium |
| Order calculator state lives in App but only used by OrderCalculator | `App.tsx` | 42 | Low |

## 5. Styling System

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- Custom theme tokens defined in `index.css` using `@theme` directive
- Custom utility classes: `.glass`, `.glass-dark`, `.text-gradient-gold`, `.bg-gradient-gold`, `.border-gradient-gold`, `.noise-bg`
- Fonts: Cairo (sans-serif) + Playfair Display (serif) via Google Fonts CDN

### Issues Found

| Issue | File | Line | Severity |
|-------|------|------|----------|
| `custom-scrollbar` class used but never defined | `OrderCalculator.tsx` | 160 | Medium |
| `scrollbar-hide` class used but never defined | `Gallery.tsx` | 20 | Medium |
| Inline `style={{ WebkitAppearance: 'none' }}` could be Tailwind class | `OrderCalculator.tsx` | 98 | Low |
| Hardcoded color values (`#120a06`, `#c8a54b`, `#25D366`) bypass theme system | `Header.tsx:5`, `App.tsx:121` | — | Medium |
| `noise-bg` pseudo-element uses SVG data URI with hardcoded `opacity` — the `opactiy` typo in the SVG source means the SVG filter attribute is ignored | `index.css` | 75 | Low |

## 6. Animation System

- **Motion (Framer Motion v12)** — imported as `motion/react`
- Scroll-linked animations: `useScroll`, `useTransform`, `useInView`
- Viewport-triggered: `whileInView` with `viewport={{ once: true }}`
- Animated counters: `animate()` function from Motion
- Exit animations: `AnimatePresence`

### Issues Found

| Issue | File | Line | Severity |
|-------|------|------|----------|
| No `prefers-reduced-motion` check — animations cannot be disabled | All components | — | High |
| Multiple `useTransform` calls in App create new instances every render | `App.tsx` | 22-27 | Medium |
| `AnimatePresence` in `Preloader` and `ExitPopup` may cause layout shifts | `Preloader.tsx`, `ExitPopup.tsx` | — | Low |

## 7. Component Organization

### Strengths
- Each section is its own component file
- Data separated from components (`/data/` directory)
- Custom hook extracted for calculator logic
- Analytics utility isolated

### Weaknesses

| Issue | Severity |
|-------|----------|
| No shared layout component — Header/Footer pattern duplicated | Medium |
| No Error Boundary wrapping lazy-loaded sections | High |
| No shared types file — interfaces defined inline in each component | Medium |
| `useOrderCalculator` hook exports constants (`coffeePrices`, `quantityPresets`, `deliveryFee`) alongside state — violates hook conventions | Low |
| No barrel exports (`index.ts`) in component/data directories | Low |

## 8. Dependency Management

### Unused Dependencies (Critical)

| Package | Declared In | Used Anywhere? | Severity |
|---------|-------------|----------------|----------|
| `@google/genai` | `package.json` dependencies | **No** — never imported in any source file | High |
| `express` | `package.json` dependencies | **No** — no server-side code exists | High |
| `dotenv` | `package.json` dependencies | **No** — `.env.local` loaded by Vite natively, not by dotenv | High |
| `esbuild` | `package.json` devDependencies | **No** — Vite uses its own esbuild, this is redundant | Medium |
| `tsx` | `package.json` devDependencies | **No** — no script uses tsx runner | Medium |

### Missing Dependencies

| Package | Needed For | Severity |
|---------|-----------|----------|
| `@types/react` | React type definitions (currently relies on Vite defaults) | Medium |

### Version Concerns

| Issue | File | Severity |
|-------|------|----------|
| `vite` listed in both `dependencies` and `devDependencies` at same version | `package.json` | Medium |

## 9. Build & Deployment

- **Vite 6** with `base: '/Hasaan-Coffee/'` for GitHub Pages
- GitHub Actions workflow: checkout → Node 20 → npm install → build → upload → deploy
- No build optimization flags (no chunk splitting, no compression)

### Issues Found

| Issue | File | Line | Severity |
|-------|------|------|----------|
| No chunk splitting strategy — all lazy components share one chunk | `vite.config.ts` | — | Medium |
| No build-time environment variable validation | `vite.config.ts` | — | Low |
| `vite.config.ts` uses `__dirname` which may fail in ESM context | `vite.config.ts` | 12 | Low |

## 10. Scalability Assessment

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Adding new sections | Easy | Create component, add to App.tsx lazy imports |
| Adding new pages | Hard | No router — would need manual path handling |
| Adding i18n | Hard | No internationalization setup, RTL baked into HTML |
| Adding a CMS | Medium | Data files would need to be replaced with API calls |
| Component reuse | Low | Components are tightly coupled to specific sections |
| State management | Low | Props drilling would become unwieldy at scale |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 4 |
| Medium | 12 |
| Low | 8 |

The architecture is appropriate for a single-page marketing site but has significant dead weight (unused dependencies, missing accessibility patterns) and would struggle to scale beyond its current scope without adding a router and proper state management.
