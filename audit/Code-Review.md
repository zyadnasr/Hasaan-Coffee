# Code Review — Hassan Coffee Website

## 1. TypeScript Quality

### tsconfig.json Analysis

**File**: `tsconfig.json`

| Setting | Value | Issue |
|---------|-------|-------|
| `strict` | **Missing** | **High** — TypeScript strict mode is not enabled. This disables `strictNullChecks`, `strictFunctionTypes`, `noImplicitAny`, `noUnusedLocals`, and more. Potential type errors are silently ignored. |
| `experimentalDecorators` | `true` | Low — No decorators are used in the project |
| `useDefineForClassFields` | `false` | Low — No class components exist |
| `skipLibCheck` | `true` | Medium — May hide type conflicts in dependencies |
| `noEmit` | `true` | OK — Correct for Vite (Vite handles transpilation) |

### `any` Usage

| File | Line | Code | Severity |
|------|------|------|----------|
| `src/utils/analytics.ts` | 4 | `window.gtag?: (...args: any[]) => void` | Low — Acceptable for gtag typing |

### Type Safety Issues

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `src/hooks/useOrderCalculator.ts` | 11 | `quantity: useState<number \| string>(1)` — Mixing number and string types creates fragile arithmetic throughout | Medium |
| `src/components/OrderCalculator.tsx` | 11 | `quantity: number \| string` in props interface — same type union propagated | Medium |
| `src/hooks/useOrderCalculator.ts` | 18 | `Number(quantity) \|\| 0` — Relies on implicit type coercion | Low |
| `src/App.tsx` | 72-73 | `showExitPopup` and `hasShownExitPopup` are boolean state — typed correctly | OK |

### Missing Types

| Issue | Severity |
|-------|----------|
| No shared TypeScript types/interfaces file — each component defines its own interfaces inline | Medium |
| `stats.ts` stat items have implicit `prefix` type that can be `"" \| "+"` but typed as just `string` | Low |
| `services.ts` icon type is `LucideIcon` but not explicitly typed | Low |

---

## 2. Component Review

### `App.tsx` — Root Component
**File**: `src/App.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 22-27 | Six `useTransform` calls create new `MotionValue` transform instances on every render. These should be computed once or memoized. | Medium |
| 42 | `useOrderCalculator()` is called at root level but only consumed by `OrderCalculator` component — unnecessary re-renders on calculator state changes propagate through App | Medium |
| 55-70 | Preloader logic mixes `load` event listener, `document.readyState` check, and a 3-second timeout. The `return` inside the `else` block (line 65) means the timeout cleanup is lost if `document.readyState === "complete"` is true at mount. | Medium |
| 72-80 | Exit popup effect has `hasShownExitPopup` in dependency array, but the effect only ever sets it to `true` — the effect re-registers unnecessarily on state change | Low |
| 84-87 | `hasMounted` timer is set to 1500ms but the preloader runs for up to 3000ms. `hasMounted` becomes `true` before preloader finishes. This means the Header sub-banner animation transitions are faster during preloading. | Low |
| 120-128 | Mobile WhatsApp button is rendered at root level with `md:hidden` — it should be in a layout component | Low |

### `Header.tsx`
**File**: `src/components/Header.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 5 | Hardcoded color `bg-[#120a06]/40` and `border-[#c8a54b]/10` — should use theme tokens `bg-brand-dark` and `border-brand-primary` | Low |
| 74-79 | Sub-banner uses `pointer-events-none` when hidden but is still in the DOM — invisible element blocks clicks on content beneath it in some scenarios | Low |
| 75 | `React.Fragment` used with `key={index}` — index keys are acceptable here since the list is static | OK |

### `Hero.tsx`
**File**: `src/components/Hero.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 7-13 | Props interface uses `React.RefObject<HTMLElement \| null>` — could use simpler `React.RefObject<HTMLElement>` | Low |
| 37-43 | Decorative haze layer loads an external Unsplash image at full resolution then blurs it — wasteful for a decorative effect | Medium |
| 40 | External URL `https://images.unsplash.com/...` as CSS background — no fallback if CDN is down | Medium |
| 17 | Hero image imported as module (`import heroImage from '../assets/images/hero-section.webp'`) — good, gets Vite-processed | OK |

### `Preloader.tsx`
**File**: `src/components/Preloader.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 3 | Imports `React` but doesn't use `React.` namespace anywhere | Low |
| 14 | `AnimatePresence` wraps the entire component — unnecessary if only used for exit animation. Could wrap just the conditional content. | Low |

### `NotFound.tsx`
**File**: `src/components/NotFound.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 20 | `onClick={() => window.location.href = '/'}` — on GitHub Pages with `base: '/Hasaan-Coffee/'`, this navigates to root `/`, not `/Hasaan-Coffee/`. Will show 404 again. | **High** |
| 23 | `window.open(...)` without `rel="noopener"` — `noreferrer` not passed to `window.open` calls | Medium |
| 12 | Hardcoded `dir="rtl"` on wrapper div — already set on `<html>` element | Low |

### `ExitPopup.tsx`
**File**: `src/components/ExitPopup.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 46 | `window.open(...)` called via onClick handler — missing `noopener`/`noreferrer` security attributes | Medium |
| 21-26 | Accessible close button has `aria-label="إغلاق"` — good | OK |

### `OrderCalculator.tsx`
**File**: `src/components/OrderCalculator.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 98 | `style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}` — inline style for vendor prefix, should be CSS | Low |
| 160 | `custom-scrollbar` class referenced but never defined in CSS | Medium |
| 104-105 | `useEffect` for click-outside detection adds global `mousedown` listener — should use `pointerdown` for better mobile support | Low |
| 10 | Imports `useRef, useEffect` from `react` — these are not namespaced, `React.` import at line 1 is unused | Low |

### `Services.tsx`
**File**: `src/components/Services.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 19 | `trackWhatsappClick` called on `<a>` click — analytics fires but component doesn't track impressions | Low |
| 24 | `key={index}` on service cards — stable since data is static, but could use `service.title` as key | Low |
| 55-56 | `target="_blank"` without explicit `rel="noopener noreferrer"` — actually has `rel="noreferrer"` on line 57, which provides `noopener` implicitly in modern browsers | OK |

### `Stats.tsx`
**File**: `src/components/Stats.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 14-30 | `AnimatedCounter` component — well-implemented with proper cleanup via `controls.stop()` | OK |
| 28 | `Math.round(v)` for non-decimal values, `v.toFixed(decimals)` for decimals — correct | OK |
| 52 | `stat.icon` accessed without null check — but `stats.ts` always provides icons | Low |

### `About.tsx`
**File**: `src/components/About.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 48-51 | External Unsplash image with `loading="lazy"` and `decoding="async"` — good practice | OK |
| 63 | Hardcoded `+1000` customer count — contradicts `stats.ts` which says `2000+` | **Medium** |
| 68 | Hardcoded `%100` stat — not present in stats data | Low |

### `Quality.tsx`
**File**: `src/components/Quality.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 21-23 | No `motion` animations on heading — static text while other sections animate | Low |
| 45 | `animate-[spin_10s_linear_infinite]` on decorative border — runs continuously, no reduced motion support | Medium |

### `Testimonials.tsx`
**File**: `src/components/Testimonials.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 24-25 | Star rating is hardcoded to 5 stars for every testimonial — no actual rating data | Low |
| 20 | Testimonial text is wrapped in curly quotes `"{testimonial.text}"` — visual only, semantic HTML would be `<blockquote>` | Low |

### `Gallery.tsx`
**File**: `src/components/Gallery.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 20 | `scrollbar-hide` class used but never defined in CSS | Medium |
| 13-17 | Gallery images are all external Unsplash/Bing URLs — no local fallbacks, inconsistent URL patterns (Unsplash vs Bing thumbnail) | Medium |
| 14 | Bing thumbnail URL (`tse3.mm.bing.net`) — fragile dependency on Bing image service, URL may break | **High** |
| 21 | `style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}` — inline styles for Firefox/IE scrollbar hiding, but Chrome/Safari need the undefined `scrollbar-hide` class | Medium |

### `Contact.tsx`
**File**: `src/components/Contact.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 44 | `target="_blank" rel="noreferrer"` on WhatsApp link — good | OK |
| 79 | External Unsplash image as map background with `alt="map bg"` — unhelpful alt text | Low |
| 96 | Google Maps link opens in new tab — should have `rel="noopener noreferrer"` | Low |

### `Footer.tsx`
**File**: `src/components/Footer.tsx`

| Line(s) | Issue | Severity |
|----------|-------|----------|
| 24 | `new Date().getFullYear()` — renders at component mount, won't update if page stays open through midnight on Dec 31 | Negligible |
| 15-22 | Navigation links duplicate Header links — no shared navigation constant | Low |

---

## 3. DRY Violations

| Violation | Files | Severity |
|-----------|-------|----------|
| WhatsApp number `01063053320` hardcoded in `useOrderCalculator.ts:4` AND `config.ts:3` | `useOrderCalculator.ts`, `config.ts` | **High** |
| Navigation links (services, about, testimonials, gallery) defined separately in Header and Footer | `Header.tsx`, `Footer.tsx` | Medium |
| WhatsApp URL pattern `wa.me/2${number}` constructed identically in 10+ locations | Multiple files | Medium |
| `glass-dark` and `glass` CSS classes used everywhere but defined only in `index.css` | OK (properly DRY) | OK |
| Unsplash background image URL repeated in 5 components | `Hero.tsx`, `NotFound.tsx`, `OrderCalculator.tsx`, `Stats.tsx`, `Contact.tsx` | Medium |

---

## 4. Magic Numbers

| File | Line | Value | What It Represents |
|------|------|-------|--------------------|
| `App.tsx` | 63 | `3000` | Preloader max duration (ms) |
| `App.tsx` | 78 | `768` | Desktop breakpoint (px) |
| `App.tsx` | 85 | `1500` | hasMounted delay (ms) |
| `Header.tsx` | 84 | `24` | Sub-banner top position |
| `Hero.tsx` | 36 | `500` | Glow blur radius (px) |
| `useOrderCalculator.ts` | 19 | `20` | Delivery fee (EGP) |
| `OrderCalculator.tsx` | 148 | `0.125` | Minimum order step (kg) |

---

## 5. Code Smells

| Smell | Location | Severity |
|-------|----------|----------|
| **Prop drilling** — whatsappNumber drilled through 6 components | `App.tsx` | Medium |
| **God component** — `App.tsx` manages all app-level state, scroll transforms, routing, preloader, exit popup | `App.tsx` | High |
| **Mixed concerns** — `useOrderCalculator` exports both state and constants | `useOrderCalculator.ts` | Low |
| **Dead code** — `@google/genai` in dependencies, never imported | `package.json` | High |
| **Dead code** — `express` in dependencies, never imported | `package.json` | High |
| **Inconsistent export style** — some components use `export default function`, data files use `export const` | Multiple | Low |
| **Inline styles mixed with Tailwind** — some components use `style={{}}` alongside className | `OrderCalculator.tsx`, `Gallery.tsx` | Low |

---

## 6. SOLID Principles Assessment

| Principle | Assessment |
|-----------|------------|
| **S** (Single Responsibility) | **Violated** — `App.tsx` handles routing, preloading, scroll transforms, exit popup, and layout |
| **O** (Open/Closed) | **Weak** — Adding a new section requires modifying `App.tsx` directly |
| **L** (Liskov Substitution) | N/A — No inheritance hierarchy |
| **I** (Interface Segregation) | **Weak** — `OrderCalculatorProps` has 12 props; interface could be split |
| **D** (Dependency Inversion) | **Violated** — Components depend directly on `config.ts` concrete values rather than injected configuration |

---

## Summary

| Category | Count |
|----------|-------|
| High Severity Issues | 5 |
| Medium Severity Issues | 15 |
| Low Severity Issues | 20 |
| DRY Violations | 5 |
| Magic Numbers | 7 |
| Code Smells | 7 |
