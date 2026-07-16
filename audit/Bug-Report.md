# Bug Report — Hassan Coffee Website

## Bug #1: NotFound Button Navigates to Wrong URL on GitHub Pages
**File**: `src/components/NotFound.tsx:20`
**Line**: 20
**Severity**: **Critical**

```tsx
<button onClick={() => window.location.href = '/'}>
```

**Description**: The "العودة للرئيسية" (Return to Home) button navigates to `/`, but the site is deployed at `/Hasaan-Coffee/`. On GitHub Pages, navigating to `/` shows the GitHub Pages 404, not the app's NotFound page.

**Impact**: Users who reach the 404 page cannot return to the homepage via the button.

**Root Cause**: The URL is hardcoded to `/` instead of using the Vite base path or `import.meta.env.BASE_URL`.

**Recommended Fix**:
```tsx
<button onClick={() => window.location.href = import.meta.env.BASE_URL}>
```

---

## Bug #2: WhatsApp Number Hardcoded in 3 Locations — Single Source of Truth Violated
**File**: `src/hooks/useOrderCalculator.ts:4`
**Line**: 4
**Severity**: **High**

```tsx
const whatsappNumber = "01063053320";
```

**Description**: The WhatsApp number is defined in three separate locations:
1. `src/data/config.ts:3` — `whatsappNumber: "01063053320"`
2. `src/hooks/useOrderCalculator.ts:4` — `const whatsappNumber = "01063053320"`
3. `index.html:47` (JSON-LD) — `"telephone": "01281515233"` (this is the PHONE number, not WhatsApp)

The `useOrderCalculator` hook duplicates the WhatsApp number from `config.ts` instead of importing it.

**Impact**: If the WhatsApp number changes, it must be updated in multiple places. Forgetting one causes inconsistent behavior.

**Root Cause**: The hook was likely created before `config.ts` was established, or the developer wanted to keep the hook self-contained.

**Recommended Fix**: Import from `config.ts`:
```tsx
import { config } from '../data/config';
const whatsappNumber = config.whatsappNumber;
```

---

## Bug #3: Data Inconsistency — Customer Count Discrepancy
**File**: `src/components/About.tsx:63` vs `src/data/stats.ts:4`
**Lines**: About.tsx:63, stats.ts:4
**Severity**: **Medium**

**About section** (`About.tsx:63`):
```tsx
<h4 className="text-3xl font-serif font-bold text-white mb-1">+1000</h4>
<p className="text-xs text-brand-primary uppercase tracking-wider">عميل سعيد</p>
```

**Stats section** (`stats.ts:4`):
```tsx
{ icon: Users, value: 2000, prefix: "+", title: "عميل سعيد", ... }
```

**Description**: The About section claims "+1000 عميل سعيد" (1000+ happy customers) while the Stats section claims "2000+ عميل سعيد". These numbers should be consistent.

**Impact**: Damages credibility — users who see both sections will notice the contradiction.

**Root Cause**: Different sections were likely created at different times with different data.

**Recommended Fix**: Use a single source of truth. Either:
1. Remove the hardcoded stat from About.tsx and reference the stats data, or
2. Update both to the same number.

---

## Bug #4: Missing CSS Classes — `custom-scrollbar` and `scrollbar-hide`
**File**: `src/components/OrderCalculator.tsx:160`, `src/components/Gallery.tsx:20`
**Lines**: OrderCalculator.tsx:160, Gallery.tsx:20
**Severity**: **Medium**

**OrderCalculator.tsx:160**:
```tsx
<div className="flex flex-col max-h-60 overflow-y-auto custom-scrollbar">
```

**Gallery.tsx:20**:
```tsx
className="flex gap-4 overflow-x-auto pb-10 scrollbar-hide snap-x pt-10"
```

**Description**: Both `custom-scrollbar` and `scrollbar-hide` CSS classes are referenced in JSX but never defined in `index.css` or any other CSS file.

**Impact**:
- `custom-scrollbar`: The quantity dropdown has no styled scrollbar — browser default is shown
- `scrollbar-hide`: The gallery scrollbar is not hidden in Chrome/Safari — only Firefox has the inline `scrollbarWidth: none` style

**Root Cause**: These classes were likely planned but never implemented, or were removed during refactoring.

**Recommended Fix**: Add to `index.css`:
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(18, 10, 5, 0.3);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 3px;
}
```

---

## Bug #5: Exit Popup Does Not Trap Focus
**File**: `src/components/ExitPopup.tsx`
**Severity**: **Medium**

**Description**: When the exit-intent popup opens, focus is not trapped inside the modal. Keyboard users can tab behind the popup overlay, and the popup doesn't receive initial focus.

**Impact**: Keyboard-only users may not be able to interact with the popup properly.

**Root Cause**: No focus management implementation.

**Recommended Fix**: Add `role="dialog"`, `aria-modal="true"`, focus trap, and Escape key handler.

---

## Bug #6: Number Input Focus Outline Removed Without Replacement
**File**: `src/components/OrderCalculator.tsx:119`
**Line**: 119
**Severity**: **Medium**

```tsx
className="w-full bg-transparent px-5 py-4 text-white focus:outline-none text-right font-bold"
```

**Description**: The `focus:outline-none` class removes the browser's default focus indicator from the number input. No alternative focus indicator (like `focus:ring-2 focus:ring-brand-primary`) is provided.

**Impact**: Keyboard users cannot see when the number input is focused.

**Root Cause**: The developer removed the default outline for aesthetic reasons without providing an accessible alternative.

**Recommended Fix**: Replace `focus:outline-none` with:
```tsx
focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-dark
```

---

## Bug #7: `vite.config.ts` Uses `__dirname` in ESM Context
**File**: `vite.config.ts:12`
**Line**: 12
**Severity**: **Low**

```ts
alias: {
  '@': path.resolve(__dirname, '.'),
},
```

**Description**: The project uses `"type": "module"` in `package.json`, which means `vite.config.ts` runs in ESM context. `__dirname` is not available in native ESM. Vite provides a polyfill for this in config files, so it works, but it's technically relying on Vite's behavior.

**Impact**: Works today because Vite polyfills `__dirname` in config files. Could break if Vite changes this behavior.

**Root Cause**: Using CommonJS pattern in ESM context.

**Recommended Fix**: Use `import.meta.url`:
```ts
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

---

## Bug #8: `noise-bg` SVG Data URI Contains Typo
**File**: `src/index.css:75`
**Line**: 75
**Severity**: **Low**

```css
background-image: url("data:image/svg+xml,...opactiy='0.05'...");
```

**Description**: The SVG filter has `opactiy='0.05'` instead of `opacity='0.05'`. However, this attribute is on the `<rect>` element, not the filter, so it controls the rectangle's opacity in the SVG. The typo means the attribute is ignored.

**Impact**: The SVG noise texture renders at full opacity within the SVG, but the outer CSS `opacity: 0.03` overrides it anyway. Visual impact is negligible.

**Root Cause**: Typo in SVG attribute name.

**Recommended Fix**: Fix the typo: `opacity='0.05'`

---

## Bug #9: Preloader Cleanup Function Lost on Early Return
**File**: `src/App.tsx:55-70`
**Lines**: 55-70
**Severity**: **Low**

```tsx
useEffect(() => {
  const path = window.location.pathname;
  if (path !== "/" && path !== "/Hasaan-Coffee/") {
    setIs404(true);
    setIsPreloading(false);
    // No return — cleanup function below won't be defined for this path
  } else {
    const handleLoad = () => setIsPreloading(false);
    if (document.readyState === "complete") {
      setIsPreloading(false);
    } else {
      window.addEventListener("load", handleLoad);
    }
    const timer = setTimeout(() => setIsPreloading(false), 3000);
    return () => {  // <-- This cleanup only runs for valid paths
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer);
    };
  }
}, []);
```

**Description**: When the path is not `/` or `/Hasaan-Coffee/`, the effect sets `is404` but doesn't return early. The cleanup function is defined inside the `else` block, so it only cleans up for valid paths. For 404 paths, no cleanup is needed (no listeners/timers), so this is technically correct but the code structure is confusing.

**Impact**: No functional impact — the cleanup is correctly scoped.

**Root Cause**: The cleanup function is defined inside the `else` block rather than at the top of the effect.

---

## Bug #10: `logo.png` Committed to Repo (2MB Unused File)
**File**: `src/assets/images/logo.png`
**Severity**: **Medium**

**Description**: The `logo.png` file is 2,134,863 bytes (2.0 MB) but is never imported or used anywhere in the source code. The favicon uses `logo.ico`, not `logo.png`.

**Impact**:
- Increases repository size by 2MB
- Clones are slower
- No functional impact on the built site (Vite won't bundle it if not imported)

**Root Cause**: The file was likely added during development and never cleaned up.

**Recommended Fix**: Delete the file or move it out of `src/assets/images/`.

---

## Bug #11: Gallery Image #2 Uses Fragile Bing Thumbnail URL
**File**: `src/components/Gallery.tsx:14`
**Line**: 14
**Severity**: **High**

```tsx
"https://tse3.mm.bing.net/th/id/OIP.9ms6nFzHbc8rbA6bRHBhnwAAAA?cb=thfc1falcon2&w=474&h=845&rs=1&pid=ImgDetMain&o=7&rm=3"
```

**Description**: Gallery image #2 uses a Bing thumbnail service URL instead of Unsplash. This URL:
- Is from a thumbnail service, not a source image — may be low resolution
- Contains session-specific parameters (`cb=thfc1falcon2`) that may expire
- Is not under the project's control

**Impact**: If the Bing URL breaks, the gallery shows a broken image.

**Root Cause**: Likely used as a quick placeholder that was never replaced with a proper Unsplash URL.

**Recommended Fix**: Replace with a proper Unsplash URL matching the coffee theme.

---

## Bug #12: `window.open()` Calls Missing Security Attributes
**File**: Multiple
**Lines**: NotFound.tsx:23, ExitPopup.tsx:46, useOrderCalculator.ts:33
**Severity**: **Medium**

```tsx
// NotFound.tsx:23
window.open(`https://wa.me/2${whatsappNumber}`, '_blank')

// ExitPopup.tsx:46
window.open(`https://wa.me/2${whatsappNumber}`, '_blank')

// useOrderCalculator.ts:33
window.open(`https://wa.me/2${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
```

**Description**: All `window.open()` calls use `'_blank'` as the target but don't pass `'noopener,noreferrer'` as the third argument.

**Impact**: The opened WhatsApp page can access `window.opener` and potentially redirect the parent page (tabnabbing). Modern browsers mitigate this for `<a>` tags but `window.open()` may not have the same protections.

**Root Cause**: Missing security best practice.

**Recommended Fix**: Add `'noopener,noreferrer'`:
```tsx
window.open(url, '_blank', 'noopener,noreferrer');
```

---

## Bug #13: Hero Decorative Haze Loads Full-Resolution External Image
**File**: `src/components/Hero.tsx:37-40`
**Line**: 37-40
**Severity**: **Medium**

```tsx
<motion.div 
  style={{ y: hazeY, opacity: hazeOpacity }}
  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2694&auto=format&fit=crop')] mix-blend-screen bg-cover bg-center pointer-events-none blur-[50px] z-10 scale-125"
/>
```

**Description**: A 2694px-wide Unsplash image is loaded, rendered, then blurred by 50px and displayed at 15% opacity. This is extremely wasteful — a small colored div or gradient would achieve the same visual effect.

**Impact**:
- ~300KB image download on initial page load
- GPU must composite a blurred full-resolution image
- External CDN dependency for a decorative effect

**Root Cause**: Developer wanted a specific color/warmth effect and used an image instead of a CSS gradient.

**Recommended Fix**: Replace with a CSS radial gradient or a tiny (10KB) color texture.

---

## Bug #14: `@google/genai` and `express` in Dependencies but Never Used
**File**: `package.json:8,11`
**Lines**: 8, 11
**Severity**: **Medium**

**Description**: Two runtime dependencies are listed but never imported anywhere in the source code:
- `@google/genai` — Google AI SDK (likely from AI Studio template)
- `express` — Node.js web framework (no server code exists)

**Impact**:
- ~260KB additional gzipped bundle weight (if tree-shaking fails)
- Increased `npm install` time
- Unnecessary attack surface
- Confusion for developers

**Root Cause**: Project was likely scaffolded from an AI Studio template that included these dependencies.

**Recommended Fix**: Remove from `package.json`:
```bash
npm uninstall @google/genai express dotenv esbuild tsx
```

---

## Bug #15: Missing `rel="noopener noreferrer"` on `<a target="_blank">` Links
**File**: Multiple
**Lines**: App.tsx:126, Header.tsx:49, Hero.tsx:108, Contact.tsx:96
**Severity**: **Low**

**Description**: Several `<a>` tags with `target="_blank"` are missing `rel="noopener noreferrer"`. While modern browsers add `noopener` by default for `<a>` tags, it's best practice to include it explicitly.

**Impact**: Low — modern browsers mitigate the risk. But older browsers or edge cases could allow tabnabbing.

**Recommended Fix**: Add `rel="noopener noreferrer"` to all external `<a>` tags.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 3 |
| Medium | 7 |
| Low | 4 |
| **Total** | **15** |
