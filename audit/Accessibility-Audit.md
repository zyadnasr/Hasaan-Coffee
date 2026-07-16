# Accessibility Audit — Hassan Coffee Website

## 1. WCAG 2.1 Compliance Summary

| Level | Criteria | Pass | Fail | Partial |
|-------|----------|------|------|---------|
| **A** | 1.1.1 Non-text Content | 2 | 6 | 2 |
| **A** | 1.3.1 Info and Relationships | 1 | 5 | 1 |
| **A** | 1.4.1 Use of Color | 1 | 0 | 0 |
| **A** | 1.4.3 Contrast (Minimum) | 0 | 3 | 2 |
| **A** | 2.1.1 Keyboard | 0 | 4 | 1 |
| **A** | 2.4.1 Bypass Blocks | 0 | 1 | 0 |
| **A** | 2.4.2 Page Titled | 1 | 0 | 0 |
| **A** | 2.4.4 Link Purpose | 0 | 3 | 2 |
| **A** | 3.1.1 Language of Page | 1 | 0 | 0 |
| **A** | 3.3.1 Error Identification | 0 | 1 | 0 |
| **AA** | 1.4.10 Reflow | 1 | 1 | 0 |
| **AA** | 1.4.11 Non-text Contrast | 0 | 2 | 1 |
| **AA** | 2.4.6 Headings and Labels | 1 | 1 | 0 |
| **AA** | 2.5.5 Target Size | 0 | 2 | 1 |
| **AA** | 3.2.4 Consistent Identification | 1 | 0 | 0 |

---

## 2. Landmark & Structure Issues

### Missing `<main>` Element
**Severity: HIGH — WCAG 2.4.1 (Bypass Blocks)**

The entire page content is rendered inside a `<div>` in `App.tsx:91`:
```tsx
<div className="min-h-screen noise-bg font-sans bg-brand-dark text-brand-light ...">
```

There is no `<main>` element wrapping the primary content. Screen reader users cannot:
- Jump directly to main content
- Identify the primary content area
- Use landmark navigation

### Missing Skip-to-Content Link
**Severity: HIGH — WCAG 2.4.1 (Bypass Blocks)**

No skip navigation link exists. Users must tab through the entire header navigation to reach content.

### Missing `<header>` Wrapper
**Severity: MEDIUM**

`Header.tsx` renders a `<nav>` element (line 10) but it's not wrapped in a `<header>` landmark.

---

## 3. Keyboard Navigation Issues

### Issue 1: No Skip-to-Content Link
**File**: All (global)
**WCAG**: 2.4.1 Bypass Blocks
**Severity**: HIGH

### Issue 2: Order Calculator Quantity Dropdown Not Keyboard-Accessible
**File**: `OrderCalculator.tsx:121-148`
**WCAG**: 2.1.1 Keyboard
**Severity**: HIGH

The custom quantity dropdown:
- Opens on `onFocus` of the input (line 126)
- Can be toggled with click (line 130)
- But preset items are `<button>` elements inside an `AnimatePresence` — they should be keyboard-accessible once focused
- However, there's no keyboard shortcut to open/close the dropdown
- Arrow keys don't navigate between presets
- Escape key doesn't close the dropdown

### Issue 3: Service Cards Are Links — Keyboard Accessible
**File**: `Services.tsx:28-78`
**WCAG**: 2.1.1 Keyboard
**Severity**: OK — Service cards use `<a>` tags, which are keyboard-accessible

### Issue 4: Exit Popup Focus Trap Missing
**File**: `ExitPopup.tsx`
**WCAG**: 2.1.2 No Keyboard Trap
**Severity**: MEDIUM

When the exit popup opens:
- Focus is not trapped inside the modal
- Focus is not moved to the popup
- Tab key can move focus behind the popup overlay
- No Escape key handler to close the popup

### Issue 5: Gallery Not Keyboard-Navigable
**File**: `Gallery.tsx:18-37`
**WCAG**: 2.1.1 Keyboard
**Severity**: MEDIUM

The horizontal scroll gallery:
- Has no keyboard controls for scrolling
- `tabIndex` not set on scroll container
- Images are not focusable
- No `role="region"` with `aria-label` for the scroll area

### Issue 6: WhatsApp FAB Button Accessible
**File**: `App.tsx:119-128`
**Severity**: LOW

The mobile WhatsApp FAB is an `<a>` tag — keyboard accessible. However:
- No `aria-label` — the link text is just an icon
- Screen readers will read the URL or nothing

---

## 4. ARIA & Semantic Issues

### Missing ARIA Labels

| Element | File | Line | Issue | Severity |
|---------|------|------|-------|----------|
| WhatsApp FAB (mobile) | `App.tsx` | 121-127 | No `aria-label` on icon-only link | Medium |
| Gallery scroll container | `Gallery.tsx` | 18 | No `role="region"` or `aria-label` | Medium |
| Quantity dropdown | `OrderCalculator.tsx` | 134 | No `role="listbox"` or `aria-expanded` | Medium |
| Coffee type select | `OrderCalculator.tsx` | 90-102 | Uses native `<select>` — OK | OK |
| Header nav links | `Header.tsx` | 39-42 | No `aria-label="Main navigation"` | Low |
| Footer nav links | `Footer.tsx` | 15-22 | No `aria-label="Footer navigation"` | Low |

### Missing ARIA Roles

| Element | Expected Role | File | Severity |
|---------|--------------|------|----------|
| Exit popup overlay | `role="dialog"` + `aria-modal="true"` | `ExitPopup.tsx` | **High** |
| Exit popup | `aria-labelledby` pointing to heading | `ExitPopup.tsx` | Medium |
| Quantity dropdown | `role="listbox"` + `aria-activedescendant` | `OrderCalculator.tsx` | Medium |
| Testimonial cards | `role="article"` or `<article>` element | `Testimonials.tsx` | Low |

### Heading Hierarchy Issues

| Issue | File | Line | Severity |
|-------|------|------|----------|
| 404 page has H1 ("404") and H2 ("يبدو أنك ضللت الطريق") — acceptable for error page | `NotFound.tsx` | 16-17 | Low |
| Main page has single H1 in Hero — correct | `Hero.tsx` | 49 | OK |

---

## 5. Color & Contrast Issues

### Contrast Ratios

| Element | FG Color | BG Color | Ratio | Required | Status |
|---------|----------|----------|-------|----------|--------|
| Body text (`text-brand-light`) | #FDFBF7 | #120A05 | ~18:1 | 4.5:1 | ✅ Pass |
| Gold text (`text-brand-primary`) | #D4AF37 | #120A05 | ~7:1 | 4.5:1 | ✅ Pass |
| Muted text (`text-brand-light/60`) | ~#9A9890 | #120A05 | ~6:1 | 4.5:1 | ✅ Pass |
| Very muted text (`text-brand-light/40`) | ~#67655F | #120A05 | ~3.5:1 | 4.5:1 | ❌ **Fail** |
| Gold button text (`text-brand-dark` on `bg-gradient-gold`) | #120A05 | #D4AF37 | ~7:1 | 4.5:1 | ✅ Pass |
| Glass border (`border-brand-primary/10`) | #D4AF37 at 10% | — | ~1.2:1 | 3:1 | ❌ **Fail** (non-text) |
| Sub-banner text (`text-brand-light/90`) | ~#E5E3DD | #120A05 at 95% | ~14:1 | 4.5:1 | ✅ Pass |
| Disabled button (`disabled:opacity-50`) | 50% opacity gold | #D4AF37 | ~3.5:1 | 4.5:1 | ❌ **Fail** |

### Issues

| Issue | File | Line | Severity |
|-------|------|------|----------|
| `text-brand-light/40` used for disclaimer text and footer — fails contrast | `OrderCalculator.tsx:166`, `Footer.tsx:8` | — | Medium |
| Glass effects with very low opacity borders are decorative only — acceptable if not conveying information | Multiple | — | Low |
| Color-only information: Service cards don't rely on color alone — icons and text are present | `Services.tsx` | — | OK |

---

## 6. Reduced Motion

**File**: No file
**WCAG**: 2.3.3 Animation from Interactions
**Severity**: **HIGH**

No `prefers-reduced-motion` media query exists anywhere in the project.

Affected animations:
| Animation | File | Line |
|-----------|------|------|
| Hero parallax scroll | `App.tsx` | 22-27 |
| Hero glow/haze parallax | `Hero.tsx` | 18-20 |
| Quality section spinning border | `Quality.tsx` | 45 |
| About section floating badge | `About.tsx` | 58-60 |
| Preloader spinning ring | `Preloader.tsx` | 13-17 |
| WhatsApp FAB ping | `App.tsx` | 122 |
| Hero badge pulse | `Hero.tsx` | 32 |
| Stats counter animation | `Stats.tsx` | 14-30 |
| Gallery image hover scale | `Gallery.tsx` | 29 |
| All `whileInView` fade/slide animations | Multiple | — |
| All `hover:-translate-y-1` effects | Multiple | — |

**Impact**: Users with vestibular disorders, motion sickness, or ADHD may experience dizziness, nausea, or distraction.

**Required fix**: Add to `index.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Form Accessibility

### Order Calculator Form
**File**: `OrderCalculator.tsx`

| Aspect | Status | Issue |
|--------|--------|-------|
| Labels | ✅ `<label>` elements present | Lines 86, 105 |
| Input type | ✅ `type="number"` | Line 113 |
| Min value | ✅ `min="0"` | Line 114 |
| Step | ✅ `step="0.125"` | Line 115 |
| Placeholder | ✅ `placeholder="اكتب الكمية أو اختر وزنًا جاهزًا"` | Line 122 |
| Required | ❌ Missing `required` attribute | Line 113 |
| Error state | ❌ No visible error message for invalid input | — |
| ARIA | ❌ No `aria-invalid`, `aria-describedby` for errors | — |
| Select element | ✅ Native `<select>` | Lines 90-102 |

---

## 8. Image Accessibility

| Image | `alt` Text | Accessible? | Issue |
|-------|-----------|-------------|-------|
| Hero image | "Hassan Coffee Premium Package" | ⚠️ | Generic — not descriptive |
| About image | "Hassan Coffee Shop Setup" | ⚠️ | Generic |
| Gallery images | "Hassan Coffee Gallery Image 1-5" | ⚠️ | Generic — should describe each image |
| Contact map bg | "map bg" | ❌ | Useless — decorative images should have empty alt (`alt=""`) |
| Logo (favicon) | N/A | OK | — |
| Decorative haze (Hero) | No img tag, CSS background | OK | — |

---

## 9. Focus Indicators

| Element | Focus Style | Issue |
|---------|------------|-------|
| Nav links | Default browser focus + `hover:text-brand-primary` | ⚠️ No custom `focus-visible` styles |
| CTA buttons | Default browser focus | ⚠️ No custom `focus-visible` styles |
| Select element | `focus:border-brand-primary focus:ring-1 focus:ring-brand-primary` | ✅ Custom focus ring |
| Input element | `focus:outline-none` (removed!) | ❌ **Removed default outline without replacement** |
| Close button (popup) | Default browser focus | ⚠️ No custom `focus-visible` styles |

### Critical Issue
**File**: `OrderCalculator.tsx:119`
```tsx
className="w-full bg-transparent px-5 py-4 text-white focus:outline-none text-right font-bold"
```

The `focus:outline-none` class **removes the focus indicator** from the number input without providing a visible alternative. Keyboard users cannot see when this input is focused.

---

## 10. Touch Target Size

**WCAG**: 2.5.5 Target Size (Level AAA) / 2.5.8 Target Size (Level AA)

| Element | Size | Meets 44x44px? | Issue |
|---------|------|----------------|-------|
| Nav links | ~44x48px | ✅ | OK |
| WhatsApp FAB | 56x56px (w-14 h-14) | ✅ | Good |
| CTA buttons | py-4/py-5, full-width | ✅ | Good |
| Close button (popup) | 24x24 (icon size) | ❌ **Too small** | Needs padding |
| Quantity dropdown toggle | 48x48 (px-4 on py-4 container) | ✅ | OK |
| Gallery dots/scroll | N/A | — | No interactive dots |
| Service card icons | w-16 h-16 containers | ✅ | But icons inside are 28px — OK |

---

## 11. Screen Reader Issues

| Issue | Severity |
|-------|----------|
| No skip-to-content link | **High** |
| No `<main>` landmark | **High** |
| Exit popup not announced (no `role="dialog"`) | **High** |
| WhatsApp FAB has no accessible name | Medium |
| Gallery has no accessible description | Medium |
| Animated counters may not be read properly | Low |
| `dir="rtl"` on NotFound wrapper div is redundant (already on `<html>`) | Low |

---

## 12. Accessibility Summary

| Category | Score |
|----------|-------|
| Semantic HTML | 35/100 |
| Keyboard Navigation | 25/100 |
| ARIA | 20/100 |
| Color & Contrast | 65/100 |
| Reduced Motion | 0/100 |
| Form Accessibility | 50/100 |
| Image Accessibility | 40/100 |
| Focus Management | 30/100 |
| Screen Reader Support | 25/100 |
| Touch Targets | 70/100 |
| **Overall Accessibility** | **28/100** |

---

## 13. WCAG 2.1 Level A Failures

| Criterion | Failure | File |
|-----------|---------|------|
| 1.1.1 Non-text Content | Generic/missing alt text on 5+ images | Multiple |
| 1.3.1 Info and Relationships | No `<main>` landmark; no dialog role on popup | `App.tsx`, `ExitPopup.tsx` |
| 2.1.1 Keyboard | Gallery not keyboard-navigable; focus management issues | `Gallery.tsx` |
| 2.4.1 Bypass Blocks | No skip-to-content link | Global |
| 2.4.4 Link Purpose | WhatsApp FAB has no accessible name | `App.tsx:121` |
| 3.3.1 Error Identification | Calculator input errors not identified | `OrderCalculator.tsx` |

**The site does not meet WCAG 2.1 Level A minimum conformance.**
