# Roadmap — Hassan Coffee Website

## Priority Legend

| Priority | Meaning |
|----------|---------|
| **P0** | Critical — Must fix immediately |
| **P1** | High — Fix this sprint |
| **P2** | Medium — Fix next sprint |
| **P3** | Low — Backlog |

## Effort Legend

| Effort | Time Estimate |
|--------|--------------|
| **XS** | < 30 minutes |
| **S** | 30 minutes – 2 hours |
| **M** | 2 – 6 hours |
| **L** | 6 – 16 hours |
| **XL** | 16+ hours |

---

## Phase 1: Critical Fixes (P0)

### 1.1 Remove Unused Dependencies
- **Why**: 5 unused packages (`@google/genai`, `express`, `dotenv`, `esbuild`, `tsx`) add ~120KB gzipped bundle, increase install time, and expand attack surface
- **Files**: `package.json`
- **Effort**: XS
- **Impact**: -120KB gzipped, faster installs, reduced attack surface
- **Risk**: None
- **Dependencies**: None

### 1.2 Fix NotFound Home Button URL
- **Why**: Button navigates to `/` instead of `/Hasaan-Coffee/`, breaking on GitHub Pages (Bug #1)
- **Files**: `src/components/NotFound.tsx:20`
- **Effort**: XS
- **Impact**: Users can return to homepage from 404 page
- **Risk**: None
- **Dependencies**: None

### 1.3 Add `prefers-reduced-motion` Support
- **Why**: WCAG 2.3.3 violation — no way to disable animations for users with vestibular disorders
- **Files**: `src/index.css`
- **Effort**: S
- **Impact**: Major accessibility improvement, legal compliance
- **Risk**: Low
- **Dependencies**: None

### 1.4 Add `<main>` Landmark
- **Why**: WCAG 2.4.1 violation — screen readers can't identify primary content
- **Files**: `src/App.tsx:91`
- **Effort**: XS
- **Impact**: Screen reader navigation improvement
- **Risk**: None
- **Dependencies**: None

### 1.5 Remove `.env.local` from Git Tracking
- **Why**: Contains placeholder API key — if a real key is ever added, it's exposed in git history
- **Files**: `.env.local` (git rm --cached)
- **Effort**: XS
- **Impact**: Security hygiene
- **Risk**: None
- **Dependencies**: None

### 1.6 Compress/Replace Favicon Files
- **Why**: `logo.ico` (238KB) and `logo.png` (2MB) are absurdly large for favicons
- **Files**: `src/assets/images/logo.ico`, `src/assets/images/logo.png`, `index.html`
- **Effort**: S
- **Impact**: -2.2MB repo size, faster page load
- **Risk**: Low
- **Dependencies**: Need design assets or compression tool

---

## Phase 2: High Priority (P1)

### 2.1 Unify WhatsApp Number Source
- **Why**: WhatsApp number hardcoded in 3 locations — single source of truth violated (Bug #2)
- **Files**: `src/hooks/useOrderCalculator.ts:4`, `src/data/config.ts`
- **Effort**: XS
- **Impact**: Maintainability — one place to update
- **Risk**: None
- **Dependencies**: None

### 2.2 Add Missing CSS Classes
- **Why**: `custom-scrollbar` and `scrollbar-hide` classes referenced but undefined (Bug #4)
- **Files**: `src/index.css`
- **Effort**: XS
- **Impact**: Gallery scrollbar hidden correctly, quantity dropdown styled
- **Risk**: None
- **Dependencies**: None

### 2.3 Add `og:image` and `twitter:image`
- **Why**: Social sharing shows no preview image — devastating for marketing
- **Files**: `index.html`
- **Effort**: S
- **Impact**: Social media click-through rates
- **Risk**: Need to create/source a 1200x630 image
- **Dependencies**: Design asset needed

### 2.4 Fix Canonical/OG URL Mismatch
- **Why**: Canonical URL says `hassancoffee.com` but site deploys to `zyadnasr.github.io/Hasaan-Coffee/`
- **Files**: `index.html`
- **Effort**: XS
- **Impact**: SEO — search engines may index the wrong URL
- **Risk**: Low
- **Dependencies**: Decision on final domain

### 2.5 Optimize Hero Image and Add Image Dimensions
- **Why**: Hero image (957KB) causes LCP delay; missing `width`/`height` causes CLS
- **Files**: `src/components/Hero.tsx`, `src/assets/images/hero-section.webp`
- **Effort**: M
- **Impact**: Better LCP, better CLS, faster load
- **Risk**: Need image optimization tool
- **Dependencies**: Image processing

### 2.6 Replace Hero Haze Decorative Image with CSS Gradient
- **Why**: Full Unsplash image (2694px) loaded just to blur it — 300KB wasted (Bug #13)
- **Files**: `src/components/Hero.tsx:37-40`
- **Effort**: S
- **Impact**: -300KB initial load
- **Risk**: Low
- **Dependencies**: None

### 2.7 Enable TypeScript Strict Mode
- **Why**: `strict: true` missing from tsconfig — hides potential type errors
- **Files**: `tsconfig.json`
- **Effort**: M
- **Impact**: Better code quality, catch bugs earlier
- **Risk**: May surface existing type errors that need fixing
- **Dependencies**: Fix any type errors that surface

### 2.8 Add Error Boundary
- **Why**: No error boundary — any component error crashes the entire app
- **Files**: New `src/components/ErrorBoundary.tsx`, `src/App.tsx`
- **Effort**: M
- **Impact**: Graceful error handling, better UX
- **Risk**: Low
- **Dependencies**: None

### 2.9 Fix Focus Outline on Number Input
- **Why**: `focus:outline-none` removes focus indicator without replacement (Bug #6)
- **Files**: `src/components/OrderCalculator.tsx:119`
- **Effort**: XS
- **Impact**: Keyboard accessibility
- **Risk**: None
- **Dependencies**: None

### 2.10 Fix Customer Count Data Inconsistency
- **Why**: About section says "+1000" but Stats says "2000+" (Bug #3)
- **Files**: `src/components/About.tsx:63`
- **Effort**: XS
- **Impact**: Credibility
- **Risk**: None
- **Dependencies**: Business decision on correct number

### 2.11 Add `window.open` Security Attributes
- **Why**: `window.open()` calls missing `noopener,noreferrer` (Bug #12)
- **Files**: `src/components/NotFound.tsx:23`, `src/components/ExitPopup.tsx:46`, `src/hooks/useOrderCalculator.ts:33`
- **Effort**: XS
- **Impact**: Security — prevents tabnabbing
- **Risk**: None
- **Dependencies**: None

### 2.12 Move Google Fonts from CSS @import to HTML <link>
- **Why**: CSS `@import` is render-blocking; HTML `<link>` can load in parallel
- **Files**: `index.html`, `src/index.css:1`
- **Effort**: S
- **Impact**: Faster FCP by ~200-500ms
- **Risk**: Low
- **Dependencies**: None

### 2.13 Reduce Font Weight Variants
- **Why**: Loading 7 Cairo weights + all Playfair Display weights — heavy
- **Files**: `index.html` (font link), `src/index.css:1`
- **Effort**: S
- **Impact**: -50-100KB font download
- **Risk**: Low — need to verify which weights are actually used
- **Dependencies**: Audit which weights appear in the UI

---

## Phase 3: Medium Priority (P2)

### 3.1 Add Mobile Navigation Menu
- **Why**: No hamburger menu — mobile users can't navigate between sections
- **Files**: `src/components/Header.tsx`
- **Effort**: L
- **Impact**: Major mobile UX improvement
- **Risk**: Medium — needs careful animation design
- **Dependencies**: None

### 3.2 Replace External Gallery Images with Local Assets
- **Why**: 5 gallery images loaded from Unsplash/Bing CDNs — fragile, slow, unauthenticated
- **Files**: `src/components/Gallery.tsx`, new `src/assets/images/gallery/`
- **Effort**: M
- **Impact**: Reliability, performance, authenticity
- **Risk**: Need actual shop photos
- **Dependencies**: Photography assets

### 3.3 Replace Bing Thumbnail URL
- **Why**: Gallery image #2 uses fragile Bing thumbnail service (Bug #11)
- **Files**: `src/components/Gallery.tsx:14`
- **Effort**: XS
- **Impact**: Reliability
- **Risk**: None
- **Dependencies**: Replacement image

### 3.4 Add Skip-to-Content Link
- **Why**: WCAG 2.4.1 — keyboard users must tab through all nav to reach content
- **Files**: `src/App.tsx` or `src/components/Header.tsx`
- **Effort**: S
- **Impact**: Keyboard accessibility
- **Risk**: None
- **Dependencies**: None

### 3.5 Add Exit Popup Focus Management
- **Why**: Modal doesn't trap focus or respond to Escape key (Bug #5)
- **Files**: `src/components/ExitPopup.tsx`
- **Effort**: M
- **Impact**: Keyboard accessibility, UX
- **Risk**: Low
- **Dependencies**: None

### 3.6 Add `robots.txt` and `sitemap.xml`
- **Why**: Missing SEO basics — search engines can't crawl efficiently
- **Files**: New `public/robots.txt`, new `public/sitemap.xml`
- **Effort**: S
- **Impact**: SEO crawlability
- **Risk**: None
- **Dependencies**: None

### 3.7 Add `<header>` Wrapper Element
- **Why**: Semantic HTML — `<nav>` should be inside `<header>`
- **Files**: `src/components/Header.tsx`
- **Effort**: XS
- **Impact**: Semantic HTML compliance
- **Risk**: None
- **Dependencies**: None

### 3.8 Use React Context for Config Values
- **Why**: WhatsApp number drilled through 6 components as props
- **Files**: New `src/contexts/ConfigContext.tsx`, multiple component files
- **Effort**: M
- **Impact**: Cleaner architecture, easier maintenance
- **Risk**: Medium — refactoring multiple files
- **Dependencies**: None

### 3.9 Add `React.memo` to Pure Components
- **Why**: Unnecessary re-renders when parent state changes
- **Files**: `Footer.tsx`, `Quality.tsx`, `Testimonials.tsx`, `About.tsx`
- **Effort**: S
- **Impact**: Fewer re-renders, better performance
- **Risk**: Low
- **Dependencies**: None

### 3.10 Add Skeleton Loading Screens
- **Why**: Lazy-loaded sections show only text "جاري التحميل..." — poor perceived performance
- **Files**: `src/App.tsx` (Suspense fallback), new skeleton components
- **Effort**: M
- **Impact**: Better perceived performance
- **Risk**: Low
- **Dependencies**: None

### 3.11 Fix Exit Popup Copy
- **Why**: Popup says "العرض مازال في انتظارك" (the offer is still waiting) but there's no actual offer
- **Files**: `src/components/ExitPopup.tsx:40`
- **Effort**: XS
- **Impact**: Better conversion messaging
- **Risk**: None
- **Dependencies**: Business decision on actual offer/copy

### 3.12 Add `aria-label` to WhatsApp FAB
- **Why**: Icon-only link has no accessible name
- **Files**: `src/App.tsx:121`
- **Effort**: XS
- **Impact**: Screen reader accessibility
- **Risk**: None
- **Dependencies**: None

### 3.13 Add Semantic Elements (blockquote, article)
- **Why**: Testimonials should use `<blockquote>`, service cards could use `<article>`
- **Files**: `src/components/Testimonials.tsx`, `src/components/Services.tsx`
- **Effort**: S
- **Impact**: Better semantics, SEO
- **Risk**: Low
- **Dependencies**: None

### 3.14 Pin GitHub Actions to SHA
- **Why**: Tag references can be mutated — SHA pinning prevents supply chain attacks
- **Files**: `.github/workflows/static.yml`
- **Effort**: S
- **Impact**: Supply chain security
- **Risk**: Low
- **Dependencies**: None

### 3.15 Self-Host Google Fonts
- **Why**: External CDN dependency for critical CSS resource
- **Files**: `index.html`, `src/index.css`, new font files
- **Effort**: L
- **Impact**: Performance (no DNS lookup, no CDN latency), reliability
- **Risk**: Medium — need to handle font licensing
- **Dependencies**: Font file downloads

---

## Phase 4: Low Priority (P3)

### 4.1 Extract Shared Navigation Links
- **Why**: Header and Footer define navigation links separately
- **Files**: `src/data/nav.ts` (new), `Header.tsx`, `Footer.tsx`
- **Effort**: XS
- **Impact**: DRY, maintainability
- **Risk**: None

### 4.2 Create Shared Image Constants
- **Why**: Unsplash URL repeated in 5 components
- **Files**: `src/data/images.ts` (new), multiple components
- **Effort**: S
- **Impact**: DRY, easier to swap images
- **Risk**: None

### 4.3 Create Shared Types File
- **Why**: Each component defines its own interfaces inline
- **Files**: `src/types/index.ts` (new), multiple components
- **Effort**: M
- **Impact**: Type consistency, IDE support
- **Risk**: Low

### 4.4 Add Lazy Image Component
- **Why**: No loading states for images — flash of unstyled content
- **Files**: New `src/components/LazyImage.tsx`
- **Effort**: M
- **Impact**: Better UX, smoother image loading
- **Risk**: Low

### 4.5 Add Lightbox to Gallery
- **Why**: Gallery images can't be viewed full-size
- **Files**: `src/components/Gallery.tsx`
- **Effort**: L
- **Impact**: Better gallery UX
- **Risk**: Low
- **Dependencies**: Consider lightbox library or custom implementation

### 4.6 Add Contact Map Embed
- **Why**: Map area shows Unsplash image instead of actual map
- **Files**: `src/components/Contact.tsx`
- **Effort**: M
- **Impact**: Better contact experience
- **Risk**: Low — Google Maps iframe may affect performance
- **Dependencies**: Google Maps API key (optional)

### 4.7 Add Social Media Links to Footer
- **Why**: No social media presence linked from the site
- **Files**: `src/components/Footer.tsx`
- **Effort**: S
- **Impact**: Social engagement
- **Risk**: None
- **Dependencies**: Social media accounts

### 4.8 Add "Back to Top" Button
- **Why**: Long page — no quick way to return to top
- **Files**: New component or addition to existing
- **Effort**: S
- **Impact**: Navigation convenience
- **Risk**: None

### 4.9 Add Product Schema Markup
- **Why**: Rich snippets for coffee products in search results
- **Files**: `index.html` or dynamic JSON-LD
- **Effort**: M
- **Impact**: SEO — product rich snippets
- **Risk**: None

### 4.10 Add FAQ Section
- **Why**: Thin content (~900 words total) — FAQ adds SEO value and reduces support queries
- **Files**: New `src/components/FAQ.tsx`, `src/data/faq.ts`, `src/App.tsx`
- **Effort**: L
- **Impact**: SEO content, user experience
- **Risk**: None

---

## Implementation Timeline

### Week 1: Critical (P0)
| Task | Effort | Time |
|------|--------|------|
| 1.1 Remove unused deps | XS | 15 min |
| 1.2 Fix NotFound URL | XS | 5 min |
| 1.3 Add reduced-motion | S | 1 hour |
| 1.4 Add `<main>` landmark | XS | 5 min |
| 1.5 Remove .env.local from git | XS | 5 min |
| 1.6 Compress favicons | S | 1 hour |
| **Total** | | **~2.5 hours** |

### Week 2: High Priority (P1)
| Task | Effort | Time |
|------|--------|------|
| 2.1 Unify WhatsApp number | XS | 5 min |
| 2.2 Add missing CSS classes | XS | 15 min |
| 2.3 Add og:image | S | 2 hours |
| 2.4 Fix canonical URL | XS | 5 min |
| 2.5 Optimize hero image | M | 3 hours |
| 2.6 Replace haze image | S | 1 hour |
| 2.7 Enable TS strict | M | 3 hours |
| 2.8 Add error boundary | M | 2 hours |
| 2.9 Fix focus outline | XS | 5 min |
| 2.10 Fix data inconsistency | XS | 5 min |
| 2.11 Add window.open security | XS | 10 min |
| 2.12 Move fonts to HTML | S | 1 hour |
| 2.13 Reduce font weights | S | 30 min |
| **Total** | | **~13 hours** |

### Week 3-4: Medium Priority (P2)
| Task | Effort | Time |
|------|--------|------|
| 3.1 Mobile nav | L | 8 hours |
| 3.2 Local gallery images | M | 3 hours |
| 3.3 Replace Bing URL | XS | 5 min |
| 3.4 Skip-to-content | S | 1 hour |
| 3.5 Exit popup focus | M | 2 hours |
| 3.6 robots.txt + sitemap | S | 1 hour |
| 3.7 Add <header> wrapper | XS | 5 min |
| 3.8 React Context | M | 3 hours |
| 3.9 React.memo | S | 1 hour |
| 3.10 Skeleton screens | M | 3 hours |
| 3.11 Fix exit popup copy | XS | 5 min |
| 3.12 Add aria-label | XS | 5 min |
| 3.13 Semantic elements | S | 1 hour |
| 3.14 Pin GH Actions | S | 30 min |
| 3.15 Self-host fonts | L | 4 hours |
| **Total** | | **~28 hours** |

---

## Expected Impact Summary

| Phase | Impact |
|-------|--------|
| Phase 1 (P0) | Critical bugs fixed, accessibility baseline, security hygiene |
| Phase 2 (P1) | SEO functional, performance improved, code quality enforced |
| Phase 3 (P2) | Mobile UX complete, architecture clean, accessibility full |
| Phase 4 (P3) | Premium polish, content depth, world-class details |

**Total estimated effort**: ~44 hours across all phases
**Recommended timeline**: 4-6 weeks for a solo developer
