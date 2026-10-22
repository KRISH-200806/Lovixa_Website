# LOVIXA COSMETIC — Application Security Review & Audit

**Auditor:** Application Security Reviewer & Senior Payload CMS Engineer  
**Audit Scope:** Next.js Storefront, Payload CMS Local API & REST Endpoints, MongoDB Models, Cloudflare R2 Media, WhatsApp Checkout Handoff  
**Date:** 2026-10-22  
**Classification:** Confidential / Redacted Internal QA Artifact  

---

## 1. Security Architecture Summary

LOVIXA COSMETIC implements defense-in-depth principles across its full-stack Next.js and Payload CMS architecture:
- **Authentication:** Payload CMS session tokens stored in secure, `httpOnly: true`, `sameSite: 'lax'`, `path: '/'` cookies.
- **Role-Based Access Control (RBAC):** Three distinct roles: `customer`, `staff`, `admin`.
- **Order Retrieval & IDOR Protection:** Customer orders accessible only to `{ customer: user.id }` or `{ customerEmail: user.email }`. Unauthenticated guests require an unguessable 64-character hexadecimal `guestAccessToken` or verified email + phone combo.
- **Media Upload Isolation:** Cloudflare R2 upload restricted strictly to `staff` and `admin`. MIME types whitelisted to safe image types only (`image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/svg+xml`). Non-image executables strictly blocked.
- **Rate Limiting:** In-memory sliding-window limiters active on `/api/checkout`, `/api/coupons/validate`, and `/api/auth/login`.

---

## 2. Threat Vector Review & Audit Findings

### 2.1 Access Control & Privilege Escalation (SEC-001, SEC-002, SEC-015, SEC-023)
- **Status:** **PASS (Remediated)**
- **Audit Evaluation:**
  - `Users.ts` field `role` restricts updates via `access.update: ({ req: { user } }) => Boolean(user && user.role === 'admin')`. A customer cannot modify their own role via profile update or registration payloads (prevents mass assignment privilege escalation).
  - Previously, `Users.access.admin` was undefined, which could have allowed customer sessions to authenticate into `/admin`.
  - **Remediation:** Added `admin: ({ req: { user } }) => Boolean(user && (user.role === 'admin' || user.role === 'staff'))` to `src/collections/Users.ts`. Automated tests verify non-admin access is blocked.

### 2.2 Financial & Order Integrity (SEC-003, SEC-004, PROD-015, COUP-019)
- **Status:** **PASS (Remediated)**
- **Audit Evaluation:**
  - Client-submitted totals in `/api/checkout` were previously accepted directly.
  - **Remediation:** Implemented authoritative server-side price verification and total recalculation in `src/app/(store)/api/checkout/route.ts`. Item prices are verified against `product-variants` or `products` collections; subtotal, discounts, shipping fees, taxes, and grand totals are calculated on the server. Tampered client prices are completely discarded.

### 2.3 Injection Defenses: NoSQL & XSS (SEC-005, SEC-006)
- **Status:** **PASS**
- **Audit Evaluation:**
  - **NoSQL Injection:** User inputs in `/api/checkout`, `/api/orders`, and `/api/coupons/validate` are sanitized and converted to primitives (`String(code).trim().toUpperCase()`, `String(phone).replace(/[^0-9]/g, '')`) before query construction, preventing MongoDB operator injection (`$gt`, `$ne`, etc.).
  - **XSS:** Storefront is built using React 19 JSX, which automatically escapes dynamic text nodes. No instances of `dangerouslySetInnerHTML` exist on user-controlled inputs.

### 2.4 CSRF & Origin Defense (SEC-007, SEC-022)
- **Status:** **PASS**
- **Audit Evaluation:**
  - State-changing endpoints (`POST /api/checkout`, `POST /api/auth/login`, `PATCH /api/auth/profile`) require JSON payloads (`application/json`), preventing simple HTML form-based CSRF attacks.
  - Session cookies enforce `sameSite: 'lax'` which prevents cross-site request embedding.
  - CORS does not configure wildcard `Access-Control-Allow-Origin: *` on credentialed routes.

### 2.5 Secret Leakage & Bundle Inspection (SEC-009, SEC-017)
- **Status:** **PASS**
- **Audit Evaluation:**
  - Verified client bundles: Sensitive secrets (`PAYLOAD_SECRET`, `REVALIDATE_SECRET`, `SETUP_SECRET`, `STRIPE_SECRET_KEY`, `R2_SECRET_ACCESS_KEY`, `MONGODB_URI`) are strictly server-side environment variables.
  - Only non-sensitive public variables (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD`, `NEXT_PUBLIC_SHIPPING_FLAT_RATE`) are exposed to client code.
  - R2 diagnostics scripts redact credentials and mask account IDs.

### 2.6 Storage & Media Security (SEC-010, SEC-011)
- **Status:** **PASS**
- **Audit Evaluation:**
  - Cloudflare R2 bucket (`lovixa`) is accessed through AWS S3 SDK credentials configured on the server.
  - Customers cannot upload files directly to R2 (`Media.access.create` returns false for customers and anonymous users).
  - Path traversal is prevented in `Media.ts` via hook: `filename.replace(/\.\.+/g, '').replace(/[/\\]/g, '')`.

### 2.7 Order Privacy & IDOR Defenses (SEC-024, ACCOUNT-004)
- **Status:** **PASS**
- **Audit Evaluation:**
  - `/api/orders` strictly segregates user records. Customer A querying order `LVX-YYYY-XXXX` owned by Customer B receives `HTTP 403 Forbidden`.
  - Unauthenticated order listing without parameters is blocked with `HTTP 401 Unauthorized`.
  - Sequential ID enumeration is impossible as order numbers use randomized 4-digit suffixes combined with 64-character unguessable guest tokens.

---

## 3. Redacted Credential Verification

| Configuration Parameter | Environment Key | Sanitized Status |
|---|---|---|
| Payload Secret | `PAYLOAD_SECRET` | Configured (Protected) |
| Revalidation Secret | `REVALIDATE_SECRET` | Configured (Protected) |
| MongoDB Atlas Connection | `MONGODB_URI` | `mongodb+srv://[REDACTED_USER]:[REDACTED_PASS]@cluster0.eldmjen.mongodb.net/` |
| Cloudflare R2 Endpoint | `R2_ENDPOINT` | `https://[REDACTED_ACCOUNT].r2.cloudflarestorage.com` |
| Cloudflare R2 Key ID | `R2_ACCESS_KEY_ID` | `1a57...5f1d` (Masked) |
| Cloudflare R2 Secret | `R2_SECRET_ACCESS_KEY` | Configured (Protected) |
| Official WhatsApp Business | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `919712460509` (Public Merchant Line) |
