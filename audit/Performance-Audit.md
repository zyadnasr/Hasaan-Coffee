# Performance Audit — Hassan Coffee Website

## 1. Bundle Analysis

### Dependencies

| Package | Type | Size (est.) | Used? | Impact |
|---------|------|-------------|-------|--------|
| `react` | runtime | ~45 KB gzipped | Yes | Core |
| `react-dom` | runtime | ~130 KB gzipped | Yes | Core |
| `motion` (Framer Motion v12) | runtime | ~80 KB gzipped | Yes | Heavy |
| `lucide-react` | runtime | ~5 KB gzipped (tree-shaken) | Yes | Moderate |
| `@google/genai` | runtime | ~200 KB gzipped | **No** | **Dead weight** |
| `express` | runtime | ~60 KB gzipped | **No** | **Dead weight** |
| `dotenv` | runtime | ~3 KB gzipped | **No** | **Dead weight** |
| `@tailwindcss/vite` | build | ~15 KB | Yes | Build tool |
| `@vitejs/plugin-react` | build | ~10 KB | Yes | Build tool |
| `vite` | build | N/A | Yes | Build tool |
| `esbuild` | build | ~30 KB | **No** | **Dead weight** |
| `tsx` | build | ~15 KB | **No** | **Dead weight** |

### Estimated Bundle Size

| Metric | Estimated |
|--------|-----------|
| Total JS (uncompressed) | ~500 KB |
| Total JS (gzipped) | ~200 KB |
| Dead code (unused deps) | ~300 KB uncompressed, ~120 KB gzipped |
| CSS (Tailwind + custom) | ~15 KB gzipped |
| Fonts (Cairo + Playfair Display) | ~200 KB (2 font families, multiple weights) |

---

## 2. Image Performance

### Local Images

| File | Size | Format | Loaded By | Optimized? |
|------|------|--------|-----------|------------|
| `hero-section.webp` | 957 KB | WebP | Hero.tsx (eager) | Partial — WebP is good, but 957KB is large |
| `logo.ico` | 238 KB | ICO | index.html (favicon) | **Poor** — ICO is obsolete, 238KB is 10x normal |
| `logo.png` | 2.0 MB | PNG | index.html (favicon) | **Poor** — 2MB PNG never loaded in app, wastes repo size |

### External Images (Unsplash & Others)

| Component | URL | Loaded | Size (est.) | Issue |
|-----------|-----|--------|-------------|-------|
| `Hero.tsx:37` | Unsplash photo (decorative haze) | Eager, full resolution | ~300 KB | **High** — loaded at 2694px width just to blur it |
| `NotFound.tsx:11` | Unsplash photo (bg) | Eager | ~100 KB | Medium — decorative, low opacity |
| `OrderCalculator.tsx:20` | Unsplash photo (bg) | Eager | ~100 KB | Medium — decorative, very low opacity (0.02) |
| `Stats.tsx:21` | Unsplash photo (bg) | Eager | ~100 KB | Medium — decorative, low opacity |
| `About.tsx:16` | Unsplash photo (main image) | Lazy | ~150 KB | OK — lazy loaded |
| `Gallery.tsx:13-17` | 5 Unsplash/Bing URLs | Lazy | ~500 KB total | Medium — all external |
| `Contact.tsx:82` | Unsplash photo (map bg) | Lazy | ~100 KB | Low — decorative |
| `Contact.tsx:50` | Unsplash photo (contact bg) | Inline SVG | Negligible | OK |

### Critical Image Issues

| Issue | File | Line | Severity |
|-------|------|------|----------|
| Hero decorative haze layer loads full Unsplash image (2694px) and applies 50px blur — extremely wasteful | `Hero.tsx` | 37-40 | **High** |
| `logo.png` (2MB) committed to repo but never used in the app | `src/assets/images/logo.png` | — | **High** |
| `logo.ico` (238KB) — typical favicon is 4-15KB | `src/assets/images/logo.ico` | — | **High** |
| Gallery image #2 is from `tse3.mm.bing.net` — Bing thumbnail service, fragile | `Gallery.tsx` | 14 | **High** |
| No `<picture>` element with multiple sources for modern formats | All images | — | Medium |
| No `width`/`height` attributes on images — causes CLS | `About.tsx`, `Gallery.tsx` | — | Medium |
| Hero image has no `width`/`height` — CLS on initial load | `Hero.tsx` | 26-29 | Medium |

---

## 3. Font Loading

**File**: `src/index.css:1`

```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
```

| Issue | Severity |
|-------|----------|
| **Render-blocking CSS import** — `@import url()` in CSS blocks rendering until font CSS is downloaded | **High** |
| Loading 7 weight variants of Cairo (300-800) — likely only need 3-4 | Medium |
| Loading all italic variants of Playfair Display (`400..900` range) — wasteful | Medium |
| No `font-display: swap` in the CSS import (Google Fonts adds it by default, but verification needed) | Low |
| No preconnect to `fonts.googleapis.com` or `fonts.gstatic.com` | Medium |
| Two font families = 2 network requests + 2-4 font file downloads per family | Medium |

**Recommendations**:
1. Add `<link rel="preconnect" href="https://fonts.googleapis.com">` to `index.html`
2. Add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` to `index.html`
3. Move font import from CSS `@import` to `<link>` in HTML (non-blocking)
4. Reduce weight variants to only those used: Cairo (400, 600, 700), Playfair Display (400, 700, 700i)

---

## 4. Rendering Performance

### Scroll-Linked Animations

**File**: `src/App.tsx:22-27`

```tsx
const bgY = useTransform(scrollY, [0, 1000], ['0%', '20%']);
const bgScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
const heroY = useTransform(scrollY, [0, 500], ['0%', '20%']);
const overlayOpacity = useTransform(scrollY, [0, 500], [0, 0.7]);
const smokeY = useTransform(scrollY, [0, 1000], ['0%', '-50%']);
```

| Issue | Severity |
|-------|----------|
| 6 `useTransform` calls in App, each subscribing to scroll events — all recompute on every scroll frame | Medium |
| Hero section has additional `useTransform` calls in `Hero.tsx:18-20` (glowOpacity, hazeY, hazeOpacity) | Medium |
| Total: 9 motion values updating on every scroll frame | Medium |
| No `will-change` hints on animated elements | Low |
| Motion library handles GPU acceleration internally — good | OK |

### Lazy Loading

**File**: `src/App.tsx:11-20`

```tsx
const OrderCalculator = lazy(() => import('./components/OrderCalculator'));
const Services = lazy(() => import('./components/Services'));
// ... 7 more lazy imports
```

| Aspect | Assessment |
|--------|------------|
| Lazy loading strategy | Good — 9 sections lazy loaded |
| Suspense fallback | Minimal — just text "جاري التحميل..." |
| Fallback styling | Uses `glass` class — consistent with design |
| Loading indicator | No skeleton screens — just text |

### Component Re-Renders

| Issue | File | Severity |
|-------|------|----------|
| `App.tsx` re-renders on every calculator state change (coffeeType, quantity) because `useOrderCalculator` is called at root | `App.tsx:42` | Medium |
| `Header` receives `isHeroInView` and `hasMounted` — re-renders on scroll when hero visibility changes | `App.tsx:92-95` | Low |
| No `React.memo` on any component | All | Medium |
| No `useMemo` or `useCallback` in any component | All | Medium |

---

## 5. Third-Party Dependencies

| Dependency | Impact | Used? |
|------------|--------|-------|
| Google Fonts CDN | Render-blocking CSS, network requests | Yes |
| Unsplash CDN | 8+ external image loads | Yes |
| Bing Thumbnail CDN | 1 external image load | Yes |
| Google Maps (via link) | None (just a link) | Yes |

### Issues

| Issue | Severity |
|-------|----------|
| 8+ external Unsplash URLs — if CDN is slow, multiple sections show broken/empty images | Medium |
| Bing thumbnail URL is fragile — `tse3.mm.bing.net` may change or block hotlinking | **High** |
| No service worker or caching strategy | Medium |
| No resource hints (preconnect, prefetch) for critical external resources | Medium |

---

## 6. Layout Shift (CLS)

| Element | Has Dimensions? | CLS Risk |
|---------|----------------|----------|
| Hero image | No `width`/`height` | **High** |
| About image | No `width`/`height`, has `aspect-[4/5]` | Low |
| Gallery images | No `width`/`height`, fixed container sizes | Medium |
| Contact map bg | No `width`/`height` | Low (decorative) |
| External images | No `width`/`height` | **High** |
| Lazy-loaded sections | Suspense fallback causes layout shift | Medium |

---

## 7. JavaScript Execution

| Metric | Assessment |
|--------|------------|
| Initial JS payload | ~200 KB gzipped (React + Motion + Lucide) |
| Time to Interactive | Likely 2-3s on 4G (heavy JS + font loading) |
| Main thread blocking | Motion library scroll handlers run on main thread |
| Long tasks | Potential during initial render (9 lazy components + preloader) |

---

## 8. Animation Performance

| Animation | Technique | GPU? | Frame Drops? |
|-----------|-----------|------|--------------|
| Hero parallax | `useTransform` → `style={{ y }}` | Yes (Motion uses transforms) | Low risk |
| Hero scale | `useTransform` → `style={{ scale }}` | Yes | Low risk |
| Service card hover | CSS `transition-all` | Yes | Low risk |
| Quality section spin | CSS `animate-[spin_10s]` | Yes (transform) | Low risk |
| About badge float | Motion `animate={{ y: [0, -10, 0] }}` | Yes | Low risk |
| Stats counter | Motion `animate()` | Yes | Low risk |
| Preloader spinner | Motion `animate={{ rotate: 360 }}` | Yes | Low risk |
| Gallery hover scale | CSS `transition-transform duration-[2s]` | Yes | Low risk |
| Noise overlay | CSS `mix-blend-mode: overlay` | Compositor | Low risk |
| Glass effects | CSS `backdrop-filter: blur()` | Compositor | **Medium** — blur is expensive on large areas |

### Issues

| Issue | Severity |
|-------|----------|
| `backdrop-filter: blur()` on header, glass cards, and multiple overlays — can cause jank on lower-end devices | Medium |
| `animate-ping` on WhatsApp FAB runs infinitely | Low |
| `animate-pulse` on hero badge runs infinitely | Low |
| `animate-[spin_10s_linear_infinite]` on quality section border runs infinitely | Low |
| No `will-change` CSS hints on scroll-animated elements | Low |

---

## 9. Tree Shaking

| Package | Tree-Shakeable? | Evidence |
|---------|-----------------|----------|
| `lucide-react` | Yes | Only used icons are imported |
| `motion` | Partially | Imported as `motion/react` — subpath imports help |
| `react` | No (inherently) | Core library |
| `react-dom` | No (inherently) | Core library |

---

## 10. Caching & CDN

| Aspect | Status |
|--------|--------|
| Service Worker | None |
| Cache Headers | Controlled by GitHub Pages (aggressive caching) |
| Asset Fingerprinting | Vite handles this for built assets |
| External Resources | No caching control (Unsplash, Google Fonts) |

---

## 11. Performance Recommendations Summary

| Priority | Recommendation | Impact |
|----------|---------------|--------|
| **P0** | Remove unused dependencies (`@google/genai`, `express`, `dotenv`, `esbuild`, `tsx`) | -120 KB gzipped |
| **P0** | Replace hero haze Unsplash load with a CSS gradient or small blur texture | -300 KB eager load |
| **P0** | Compress/replace `logo.ico` (238 KB → ~10 KB) | -228 KB |
| **P1** | Move Google Fonts from CSS `@import` to `<link>` with `preconnect` | Faster FCP |
| **P1** | Reduce Cairo font weights to 400, 600, 700 | -50 KB font |
| **P1** | Add `width`/`height` to all images to prevent CLS | Better CLS score |
| **P1** | Replace Bing thumbnail URL with local asset | Reliability |
| **P2** | Add `React.memo` to pure components (Footer, Quality, Testimonials) | Fewer re-renders |
| **P2** | Add `useMemo`/`useCallback` where appropriate | Fewer re-renders |
| **P2** | Add skeleton screens for lazy-loaded sections | Better perceived performance |
| **P2** | Reduce `backdrop-filter: blur()` usage on mobile | Better mobile performance |
| **P3** | Add `<link rel="preload">` for hero image | Faster LCP |
| **P3** | Implement resource hints for Unsplash CDN | Faster image loads |

---

## 12. Estimated Lighthouse Scores (Current)

| Metric | Estimated Score | Notes |
|--------|----------------|-------|
| Performance | 45-55 | Heavy JS, render-blocking fonts, large images |
| First Contentful Paint | 2.0-3.0s | Font loading + JS execution |
| Largest Contentful Paint | 3.0-4.5s | Hero image (957KB) + font rendering |
| Total Blocking Time | 200-400ms | Motion library + component rendering |
| Cumulative Layout Shift | 0.1-0.3 | Missing image dimensions, lazy load shifts |
| Speed Index | 2.5-4.0s | Depends on CDN performance |

---

## Summary

| Category | Score |
|----------|-------|
| Bundle Size | 35/100 |
| Image Optimization | 30/100 |
| Font Loading | 40/100 |
| Rendering Performance | 50/100 |
| Third-Party Impact | 45/100 |
| Layout Stability | 40/100 |
| Animation Performance | 65/100 |
| Caching Strategy | 50/100 |
| **Overall Performance** | **42/100** |
