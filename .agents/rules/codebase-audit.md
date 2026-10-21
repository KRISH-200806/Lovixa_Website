# 🏆 8-Pillar Enterprise Market Standards Audit Rule

This rule guides automated and manual mid-project codebase audits to ensure 100% compliance with modern enterprise market standards.

---

## 8 Core Enterprise Pillars

1. **Security & Secrets (OWASP/SOC2)**: Zero private secret exposure in client bundles, immutable admin audit logs, security headers/CSP, Zod form sanitization, Turnstile/rate limiting.
2. **Next.js 15 & React 19 Architecture**: Server Components default (0 client page roots), global/nested error boundaries, loading suspense boundaries, `next/script` discipline, ISR cache tagging.
3. **Payload CMS 3.x Patterns**: System ID stripping hooks on all schemas, PostgreSQL 63-char identifier safety, Section Source Map junction table ownership, hook loop recursion guards, draft/publish separation, disaster recovery backup.
4. **Design System, Tokens & Mobile UX**: 100% token-driven colors (0 hardcoded hex codes), admin-editable theme settings, zero horizontal scroll (`overflow-x: clip`), iOS Safari auto-zoom prevention (min 16px inputs), mobile-first responsive breakpoints, 44x44px touch targets.
5. **Animation & Motion Standards**: `motion` package only (0 legacy `framer-motion`), GPU-only transforms (`transform`, `opacity`), reduced motion support.
6. **Accessibility (WCAG 2.1 AA)**: Descriptive alt tags / `<SafeImage>`, single `<h1>` hierarchy per page, accessible form labels.
7. **Performance & Core Web Vitals**: `<SafeImage>` layout shift prevention, `next/font` zero-CLS font rendering, server-side Sharp image compression.
8. **Modern SEO, GEO & AEO**: Dynamic metadata & OpenGraph, XML sitemaps, robots.txt, `llms.txt` for AI search crawlers (Perplexity, ChatGPT, Claude), JSON-LD structured data, keyword plan linking.

---

## Running the Audit

```bash
pnpm run audit:rules
```
Or with native Node:
```bash
node scripts/audit-codebase.mjs
```
