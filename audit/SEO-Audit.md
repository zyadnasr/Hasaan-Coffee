# SEO Audit — Hassan Coffee Website

## 1. Meta Tags Analysis

**File**: `index.html`

### Title Tag
```html
<title>حسن كوفي | بن طازة يوميًا وطحن حسب الطلب</title>
```
| Aspect | Status | Notes |
|--------|--------|-------|
| Length | ✅ ~45 chars | Good — under 60 char limit |
| Keywords | ✅ Contains "بن طازة", "طحن حسب الطلب" | Relevant |
| Brand | ✅ Contains "حسن كوفي" | Present |
| Language | ✅ Arabic | Correct for target audience |

### Meta Description
```html
<meta name="description" content="حسن كوفي يقدم أجود أنواع البن الطازج، البن المحوج، البن السادة، وبن البندق مع الطحن حسب الطلب والتوصيل السريع." />
```
| Aspect | Status | Notes |
|--------|--------|-------|
| Length | ✅ ~100 chars | Good — under 160 char limit |
| Keywords | ✅ Contains product names | Relevant |
| CTA | ⚠️ No call-to-action | Could add "اطلب الآن" or "تواصل معنا" |

### Canonical URL
```html
<link rel="canonical" href="https://hassancoffee.com/" />
```
| Aspect | Status | Notes |
|--------|--------|-------|
| Present | ✅ Yes | Good |
| Matches deployment | ❌ **Mismatch** | Site deploys to `zyadnasr.github.io/Hasaan-Coffee/`, but canonical says `hassancoffee.com` |
| Trailing slash | ✅ Consistent | — |

### Robots Meta
```html
<meta name="robots" content="index, follow" />
```
| Aspect | Status | Notes |
|--------|--------|-------|
| Present | ✅ Yes | Good |
| Value | ✅ `index, follow` | Correct for public site |

---

## 2. Open Graph Tags

**File**: `index.html:16-19`

| Tag | Value | Issue |
|-----|-------|-------|
| `og:title` | ✅ "حسن كوفي \| بن طازة يوميًا وطحن حسب الطلب" | Matches title |
| `og:description` | ✅ Same as meta description | Good |
| `og:type` | ✅ "website" | Correct |
| `og:url` | ❌ `https://hassancoffee.com/` | **Mismatch** — actual URL is `https://zyadnasr.github.io/Hasaan-Coffee/` |
| `og:image` | ❌ **Missing** | **Critical** — no social sharing image |
| `og:locale` | ❌ **Missing** | Should be `ar_EG` for Arabic (Egypt) |
| `og:site_name` | ❌ **Missing** | Should be "حسن كوفي" |

---

## 3. Twitter Cards

**File**: `index.html:22-24`

| Tag | Value | Issue |
|-----|-------|-------|
| `twitter:card` | ✅ "summary_large_image" | Good format |
| `twitter:title` | ✅ Matches title | Good |
| `twitter:description` | ✅ Matches description | Good |
| `twitter:image` | ❌ **Missing** | **Critical** — card type is `summary_large_image` but no image provided |
| `twitter:site` | ❌ **Missing** | Should be Twitter handle |

---

## 4. Structured Data (JSON-LD)

**File**: `index.html:30-49`

```json
{
  "@context": "https://schema.org",
  "@type": "CoffeeShop",
  "name": "حسن كوفي",
  "image": "https://images.unsplash.com/...",
  "@id": "https://hassancoffee.com/",
  "url": "https://hassancoffee.com/",
  "telephone": "01281515233",
  "openingHoursSpecification": { ... },
  "sameAs": ["https://wa.me/201281515233"]
}
```

| Aspect | Status | Issue |
|--------|--------|-------|
| Schema type | ✅ `CoffeeShop` | Correct |
| Name | ✅ "حسن كوفي" | Good |
| Image | ❌ Uses Unsplash stock photo | Should use actual shop photo or logo |
| @id | ❌ `hassancoffee.com` | **Mismatch** with actual deployment URL |
| URL | ❌ `hassancoffee.com` | **Mismatch** |
| Telephone | ✅ Present | Good |
| Opening hours | ✅ 7 days, 08:00-00:00 | Good |
| sameAs | ⚠️ Only WhatsApp link | Missing Instagram, Facebook, etc. |
| Address | ❌ **Missing** | Should include `address` property |
| geo | ❌ **Missing** | Should include coordinates for local search |
| priceRange | ❌ **Missing** | Would help with rich snippets |
| aggregateRating | ❌ **Missing** | Could include the 4.9/5 rating from stats |

### Missing Schema Types

| Schema | Purpose |
|--------|---------|
| `Product` | For coffee products with prices |
| `Offer` | For pricing information |
| `BreadcrumbList` | For navigation breadcrumbs |
| `FAQPage` | If FAQ section is added |

---

## 5. Semantic HTML

### Heading Hierarchy

| Element | Location | Text | Level |
|---------|----------|------|-------|
| `<h1>` | `Hero.tsx:49` | "بن طازة بأعلى جودة" | H1 ✅ |
| `<h2>` | `OrderCalculator.tsx:44` | "حسب سعر طلبك" | H2 ✅ |
| `<h2>` | `Services.tsx:22` | "خدمات حسن كوفي" | H2 ✅ |
| `<h2>` | `Stats.tsx:26` | "أرقام نفتخر بها" | H2 ✅ |
| `<h2>` | `About.tsx:56` | "شغف القهوة، من المحمصة إلى فنجانك" | H2 ✅ |
| `<h2>` | `Quality.tsx:11` | "التزامنا بالجودة" | H2 ✅ |
| `<h2>` | `Testimonials.tsx:12` | "ماذا يقولون عنا" | H2 ✅ |
| `<h2>` | `Contact.tsx:31` | "اطلب قهوتك الآن" | H2 ✅ |
| `<h2>` | `NotFound.tsx:17` | "يبدو أنك ضللت الطريق" | H2 ✅ |
| `<h1>` | `NotFound.tsx:16` | "404" | **H1 ⚠️** — Two H1s on 404 page |

**Assessment**: Heading hierarchy is good — single H1 on main page, H2s for sections. The 404 page has two H2-level elements but one is an H1 ("404"), which is acceptable for an error page.

### Landmark Elements

| Element | Present? | File | Issue |
|---------|----------|------|-------|
| `<header>` | ❌ No | — | Uses `<nav>` inside fragment, no `<header>` wrapper |
| `<main>` | ❌ No | — | **Critical** — No `<main>` landmark |
| `<footer>` | ✅ Yes | `Footer.tsx:8` | Present |
| `<nav>` | ✅ Yes | `Header.tsx:10` | Present |
| `<section>` | ✅ Yes | All section components | Present |
| `<article>` | ❌ No | — | Testimonials could use `<article>` |
| `<aside>` | ❌ No | — | Not needed |

### Missing Semantic Elements

| Element | Where | Severity |
|---------|-------|----------|
| `<main>` | Should wrap all content between Header and Footer | **High** |
| `<header>` | Should wrap the `<nav>` in Header.tsx | Medium |
| `<blockquote>` | Testimonials text should use `<blockquote>` | Medium |
| `<figure>` / `<figcaption>` | Gallery images lack captions | Low |

---

## 6. Image SEO

| Image | `alt` Text | Issue |
|-------|-----------|-------|
| Hero image | "Hassan Coffee Premium Package" | Generic — should describe actual image |
| About image | "Hassan Coffee Shop Setup" | Generic |
| Gallery images | "Hassan Coffee Gallery Image 1-5" | Non-descriptive |
| Contact map bg | "map bg" | Useless alt text |
| Logo (favicon) | N/A (favicon) | OK |

**Issues**:
- All alt texts are generic/placeholder — should describe actual content for accessibility AND SEO
- No `loading="lazy"` on hero image (it's above the fold — correct)
- No `width`/`height` attributes — causes CLS

---

## 7. URL & Domain Issues

| Issue | Severity |
|-------|----------|
| Canonical URL (`hassancoffee.com`) doesn't match deployment URL (`zyadnasr.github.io/Hasaan-Coffee/`) | **High** |
| OG URL same mismatch | **High** |
| JSON-LD `@id` and `url` same mismatch | **High** |
| No sitemap.xml | **High** |
| No robots.txt | **High** |
| GitHub Pages base path (`/Hasaan-Coffee/`) not reflected in any URL metadata | **High** |

---

## 8. Keywords Analysis

**File**: `index.html:8`
```html
<meta name="keywords" content="بن طازة, بن محوج, بن سادة, بن بالبندق, طحن حسب الطلب, أفضل بن في الزقازيق, قهوة عربية, بن فاخر" />
```

| Aspect | Status | Notes |
|--------|--------|-------|
| Relevance | ✅ Good | Contains product names and location |
| Location targeting | ✅ "الزقازيق" | Local SEO keyword present |
| Length | ✅ 8 keywords | Appropriate |
| Meta keywords tag | ⚠️ Ignored by Google | Has no SEO value but not harmful |

---

## 9. Internal Linking

| Link | From | To | Issue |
|------|------|----|-------|
| `#services` | Header, Footer | Services section | ✅ |
| `#about` | Header, Footer | About section | ✅ |
| `#testimonials` | Header, Footer | Testimonials section | ✅ |
| `#gallery` | Header | Gallery section | ✅ |
| `#quality` | Footer | Quality section | ✅ |
| `#calculator` | None | Calculator section | ❌ **Not linked from nav** |
| `#contact` | None | Contact section | ❌ **Not linked from nav or footer** |

---

## 10. Performance SEO

| Factor | Status | Issue |
|--------|--------|-------|
| Core Web Vitals | ⚠️ Likely poor | Heavy JS, large images, render-blocking fonts |
| Mobile-friendly | ✅ Yes | Responsive design |
| HTTPS | ✅ Yes | GitHub Pages provides HTTPS |
| Page speed | ⚠️ Slow | ~200KB JS + 957KB hero + external fonts |
| No redirects | ✅ | Direct access |

---

## 11. GitHub Pages SEO Compatibility

| Aspect | Status | Issue |
|--------|--------|-------|
| HTTPS | ✅ | GitHub Pages serves over HTTPS |
| Custom domain | ❌ | Using `zyadnasr.github.io` subdomain |
| Sitemap | ❌ Missing | Should generate or create `sitemap.xml` |
| Robots.txt | ❌ Missing | Should create `public/robots.txt` |
| 404 page | ✅ | Custom 404 implemented |
| Clean URLs | ⚠️ | Single page — all routes are the same page |

---

## 12. Missing SEO Elements

| Element | Priority | Impact |
|---------|----------|--------|
| `sitemap.xml` | **High** | Search engines can't discover page efficiently |
| `robots.txt` | **High** | No crawl directives |
| `og:image` | **High** | Social sharing shows no image |
| `twitter:image` | **High** | Twitter cards show no image |
| `og:locale` | Medium | Helps Facebook determine language |
| `og:site_name` | Low | Brand name in social shares |
| `<link rel="alternate" hreflang="ar">` | Medium | Language targeting |
| `<link rel="icon">` sizes attribute | Low | Better favicon handling |
| Breadcrumb navigation | Low | Rich snippet potential |
| FAQ schema | Low | Rich snippet potential |
| Product schema | Medium | Rich snippets for products |

---

## 13. Content SEO

| Page | Word Count | Assessment |
|------|-----------|------------|
| Hero | ~50 words | Good — concise, benefit-focused |
| Calculator | ~100 words | Good — functional content |
| Services | ~150 words | Good — descriptive |
| Stats | ~30 words | Minimal — numbers only |
| About | ~200 words | Good — brand story |
| Quality | ~80 words | Minimal |
| Testimonials | ~200 words | Good — social proof |
| Gallery | ~10 words | No text content |
| Contact | ~100 words | Good — comprehensive |

**Total unique content**: ~900 words — **Thin content** for SEO. Consider adding:
- Product descriptions with prices
- Blog/articles about coffee
- FAQ section
- Delivery information page

---

## Summary

| Category | Score |
|----------|-------|
| Meta Tags | 60/100 |
| Open Graph | 25/100 |
| Twitter Cards | 30/100 |
| Structured Data | 50/100 |
| Semantic HTML | 45/100 |
| Image SEO | 30/100 |
| URL Strategy | 20/100 |
| Technical SEO | 40/100 |
| Content SEO | 50/100 |
| **Overall SEO** | **48/100** |
