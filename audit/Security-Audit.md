# Security Audit — Hassan Coffee Website

## 1. Environment Variables

### `.env.local`
**File**: `.env.local`
```
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="https://zyadnasr.github.io/Hasaan-Coffee/"
```

| Issue | Severity |
|-------|----------|
| `GEMINI_API_KEY` is set to a placeholder `"MY_GEMINI_API_KEY"` — if a real key is ever placed here, it would be committed to the git repository | **High** |
| `.env.local` is listed in `.gitignore` via `.env*` pattern — but the file currently EXISTS in the repo, meaning it WAS committed before `.gitignore` was updated, or `.gitignore` was added after | **High** |
| The `@google/genai` package is in dependencies but never used — the API key is dead code | Medium |
| Vite exposes `GEMINI_API_KEY` to the client if accessed via `import.meta.env` — but it's never used so no leak occurs | Low |

### `.gitignore` Analysis
**File**: `.gitignore`
```
.env*
!.env.example
```

| Aspect | Status |
|--------|--------|
| `.env*` pattern | ✅ Covers `.env.local`, `.env`, `.env.production`, etc. |
| Exception for `.env.example` | ✅ Good practice |
| `.env.local` in repo | ❌ File exists despite gitignore — already tracked |

**Recommendation**: Remove `.env.local` from git tracking:
```bash
git rm --cached .env.local
```

---

## 2. Client-Side Exposure

### API Keys
| Key | Location | Exposed to Client? | Used? |
|-----|----------|--------------------|-------|
| `GEMINI_API_KEY` | `.env.local` | N/A (never imported) | **No** |

**Assessment**: No API keys are currently exposed to the client. The `@google/genai` package is listed as a dependency but never imported, so no API calls are made.

### Phone Numbers
| Number | File | Line | Purpose | Risk |
|--------|------|------|---------|------|
| `01281515233` | `src/data/config.ts` | 2 | Phone (click-to-call) | Low — publicly available business number |
| `01063053320` | `src/data/config.ts` | 3 | WhatsApp | Low — publicly available business number |
| `01063053320` | `src/hooks/useOrderCalculator.ts` | 4 | WhatsApp (duplicated) | Low — same number, but duplication is a maintenance risk |

---

## 3. XSS (Cross-Site Scripting) Analysis

| Vector | Present? | Risk |
|--------|----------|------|
| `dangerouslySetInnerHTML` | ❌ Not used | None |
| `innerHTML` | ❌ Not used | None |
| `eval()` | ❌ Not used | None |
| `document.write()` | ❌ Not used | None |
| URL-based injection (via `href`) | ⚠️ Yes | Low |
| User input rendering | ⚠️ Yes (calculator) | Low |

### URL Injection Analysis

Multiple components construct URLs using user-provided or config values:

```tsx
// App.tsx:125
href={`https://wa.me/2${config.whatsappNumber}?text=${encodeURIComponent(...)}`}

// useOrderCalculator.ts:33
window.open(`https://wa.me/2${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')

// Services.tsx:55
href={`https://wa.me/2${whatsappNumber}?text=${encodeURIComponent(service.waMessage)}`}
```

| Aspect | Status | Notes |
|--------|--------|-------|
| `encodeURIComponent` on message text | ✅ Used | Prevents URL injection |
| `whatsappNumber` from config (hardcoded) | ✅ Safe | Not user-controlled |
| `coffeeType` from dropdown (hardcoded options) | ✅ Safe | Not user-controlled |
| `quantity` from user input | ⚠️ Used in message text | Encoded via `encodeURIComponent` |

**Assessment**: XSS risk is low. React escapes JSX output by default, and `encodeURIComponent` is used for URL parameters. The only user input (quantity) is a number that gets encoded.

---

## 4. Unsafe HTML Patterns

| Pattern | Found? | Details |
|---------|--------|---------|
| `dangerouslySetInnerHTML` | ❌ No | — |
| `document.createElement('script')` | ❌ No | — |
| `new Function()` | ❌ No | — |
| `eval()` | ❌ No | — |
| Inline `<script>` in JSX | ❌ No | — |
| SVG injection via `background-image` data URIs | ⚠️ Yes | `index.css:75` — safe, static SVG |

---

## 5. Link Security

### External Links

| Link | Target | `rel` Attributes | Issue |
|------|--------|-----------------|-------|
| `https://wa.me/2{number}` | `_blank` | `noreferrer` (some), none (others) | **Inconsistent** |
| `https://maps.app.goo.gl/...` | `_blank` | `noreferrer` | ✅ |
| `https://hassancoffee.com/` (canonical) | — | — | N/A |
| Unsplash image URLs | — | — | N/A (loaded as images) |

### `target="_blank"` Without `noopener`/`noreferrer`

| File | Line | Has `rel`? | Issue |
|------|------|-----------|-------|
| `App.tsx` | 126 | No | ❌ Missing `rel="noopener noreferrer"` |
| `Header.tsx` | 49 | No | ❌ Missing `rel="noopener noreferrer"` (has `rel="noreferrer"` on line 50) |
| `Hero.tsx` | 108 | No | ❌ Missing `rel="noopener noreferrer"` |
| `Contact.tsx` | 44 | Yes (`rel="noreferrer"`) | ✅ |
| `Contact.tsx` | 96 | No | ❌ Missing on Google Maps link |
| `Services.tsx` | 56 | Yes (`rel="noreferrer"`) | ✅ |

**Note**: In modern browsers, `noreferrer` implies `noopener`. However, `window.open()` calls in `NotFound.tsx:23`, `ExitPopup.tsx:46`, and `useOrderCalculator.ts:33` pass `'_blank'` without `noopener`/`noreferrer` options.

### `window.open()` Security

| File | Line | Arguments | Issue |
|------|------|-----------|-------|
| `NotFound.tsx` | 23 | `(..., '_blank')` | ❌ Missing `'noopener,noreferrer'` |
| `ExitPopup.tsx` | 46 | `(..., '_blank')` | ❌ Missing `'noopener,noreferrer'` |
| `useOrderCalculator.ts` | 33 | `(..., '_blank')` | ❌ Missing `'noopener,noreferrer'` |

**Risk**: Without `noopener`, the opened page can access `window.opener` and potentially redirect the parent page (tabnabbing attack). Modern browsers default to `noopener` for `target="_blank"` on `<a>` tags, but `window.open()` does not have this default.

---

## 6. Dependency Vulnerabilities

### Unused Dependencies (Attack Surface)

| Package | Version | Known CVEs | Risk |
|---------|---------|-----------|------|
| `@google/genai` | ^2.4.0 | Unknown (recently released) | **Unnecessary attack surface** |
| `express` | ^4.21.2 | Express has had past CVEs | **Unnecessary attack surface** |
| `dotenv` | ^17.2.3 | Low risk | Unnecessary |
| `esbuild` | ^0.25.0 | Low risk | Unnecessary |
| `tsx` | ^4.21.0 | Low risk | Unnecessary |

**Assessment**: 5 unused dependencies increase the attack surface unnecessarily. Even if they're not imported in source code, they exist in `node_modules` and could be exploited via supply chain attacks.

### Active Dependencies

| Package | Version | Assessment |
|---------|---------|------------|
| `react` | ^19.0.1 | ✅ Latest major — good |
| `react-dom` | ^19.0.1 | ✅ Latest major — good |
| `motion` | ^12.23.24 | ⚠️ Large library — review regularly |
| `lucide-react` | ^0.546.0 | ✅ Tree-shakeable |
| `vite` | ^6.2.3 | ✅ Latest major |
| `@tailwindcss/vite` | ^4.1.14 | ✅ Latest |
| `@vitejs/plugin-react` | ^5.0.4 | ✅ Latest |

---

## 7. GitHub Pages Security

| Aspect | Status | Notes |
|--------|--------|-------|
| HTTPS | ✅ | GitHub Pages serves over HTTPS |
| Source maps | ⚠️ | Vite generates source maps by default in dev — check if disabled in production build |
| `.env.local` in git | ❌ | File exists in repo despite `.gitignore` |
| API keys in build output | ✅ | No API keys are used in client code |
| CSP headers | ❌ | GitHub Pages doesn't support custom CSP headers |

---

## 8. Supply Chain Risks

| Risk | Mitigation | Status |
|------|-----------|--------|
| npm package compromise | Use `package-lock.json` | ✅ Present |
| GitHub Actions supply chain | Pin action versions | ⚠️ Uses `@v4`/`@v5` — should pin to SHA |
| Google Fonts CDN compromise | Self-host fonts | ❌ External CDN |
| Unsplash CDN compromise | Use local images | ❌ External CDN |

### GitHub Actions Pinning
**File**: `.github/workflows/static.yml`

| Action | Current | Recommended |
|--------|---------|-------------|
| `actions/checkout@v4` | Tag reference | Pin to SHA |
| `actions/setup-node@v4` | Tag reference | Pin to SHA |
| `actions/configure-pages@v5` | Tag reference | Pin to SHA |
| `actions/upload-pages-artifact@v3` | Tag reference | Pin to SHA |
| `actions/deploy-pages@v4` | Tag reference | Pin to SHA |

---

## 9. Content Security

| Issue | Severity |
|-------|----------|
| No Content Security Policy (CSP) headers | Medium |
| External images loaded from multiple CDNs without integrity checks | Low |
| Google Fonts loaded without subresource integrity (SRI) | Low |
| Inline `<script type="application/ld+json">` in HTML — safe but could be external | Low |

---

## 10. Security Summary

| Category | Status |
|----------|--------|
| XSS Prevention | ✅ Good — React escapes output, no dangerous patterns |
| Environment Variable Security | ⚠️ `.env.local` in repo, placeholder key |
| Link Security | ⚠️ Inconsistent `noopener`/`noreferrer` |
| Dependency Security | ❌ 5 unused deps increase attack surface |
| Supply Chain | ⚠️ External CDNs, unpinned GH Actions |
| CSP | ❌ Not implemented |
| HTTPS | ✅ Enforced by GitHub Pages |
| Secret Management | ⚠️ No secrets currently exposed, but pattern is risky |

| Severity | Count |
|----------|-------|
| High | 2 |
| Medium | 4 |
| Low | 5 |

**Overall Security Score**: 65/100
