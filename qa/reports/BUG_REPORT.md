# LOVIXA COSMETIC — Official Defect & Bug Report

**Project:** LOVIXA COSMETIC E-Commerce Platform  
**Audit Date:** 2026-10-22  
**Auditor:** Principal QA Architect & Application Security Reviewer  
**Branch:** `qa/master-audit-and-tests`  
**Status:** 3 Security/Logic Defects Discovered, Replicated, Patched & Verified via Automated Regression Tests.

---

### BUG-001 — Client-Side Price, Coupon Discount, & Grand Total Tampering in `/api/checkout`
- **Severity / Priority:** **P0 / Blocker** (Direct Financial & Integrity Breach)
- **Environment / Build:** Staging / Local / Production API
- **Route / API:** `POST /api/checkout`
- **Related Test IDs:** `PROD-015`, `COUP-019`, `CHECK-017`, `SEC-003`, `SEC-004`, `WA-018`
- **Preconditions:** Storefront running with standard checkout route.
- **Reproduction Steps:**
  1. Intercept or submit a direct POST payload to `/api/checkout` with catalog item `productId: "prod_shampoo"`.
  2. Send tampered client values: `"price": 1`, `"subtotal": 1`, `"discountTotal": 0`, `"shippingTotal": 0`, `"grandTotal": 1`.
  3. Inspect the created order in MongoDB and the generated WhatsApp deep link text.
- **Expected Result:**
  Server must reject or overwrite client pricing with authoritative catalog values (Shampoo ₹299 + ₹99 flat shipping = ₹398). The created order and WhatsApp prefilled message must strictly reflect ₹398.
- **Actual Result (Before Fix):**
  Server blindly assigned `finalGrandTotal = Number(grandTotal)` and `finalSubtotal = Number(subtotal)` directly from the untrusted request body. It created an order record for ₹1 and generated a WhatsApp handoff message demanding only ₹1 from the customer.
- **Root Cause (Verified):**
  In [`src/app/(store)/api/checkout/route.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/api/checkout/route.ts), while inventory stock was checked via `validateItemsStock`, there was no server-side lookup of authoritative prices from `products` or `product-variants` collections, nor was there server-side recalculation of subtotal, coupon discount, shipping rules, or grand total.
- **Fix Applied:**
  1. Implemented server-side authoritative price resolution: looks up `product-variants` or `products` collections or fallback catalog constants.
  2. Computed authoritative subtotal `calculatedSubtotal = sum(verifiedPrice * verifiedQuantity)`.
  3. Recomputed genuine coupon discount against CMS rules and campaign limits on the server.
  4. Enforced store shipping policy (`subtotal >= freeShippingThreshold ? 0 : flatRate`).
  5. Enforced grand total `max(0, subtotal - discount + shipping)`.
  6. Generated WhatsApp message and database record exclusively using server-calculated amounts.
- **Retest Result:**
  **PASS**. Client-tampered values are completely ignored and replaced by authoritative numbers.
- **Regression Tests:**
  [`tests/qa-pricing-tampering-regression.test.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/tests/qa-pricing-tampering-regression.test.ts) (5 automated subtests all passing).

---

### BUG-002 — Missing Admin Panel Access Control on `Users` Collection Permitting Customer Role Access
- **Severity / Priority:** **P0 / Blocker** (Privilege Escalation / Admin Unauthorized Access)
- **Environment / Build:** Payload CMS 3 Admin Surface
- **Route / Collection:** `/admin`, `src/collections/Users.ts`
- **Related Test IDs:** `AUTH-017`, `ADMIN-009`, `SEC-002`, `SEC-015`
- **Preconditions:** Registered user account with default `role: 'customer'`.
- **Reproduction Steps:**
  1. Register or log in as a customer account.
  2. Navigate directly to `/admin` or call administrative Local API functions.
  3. Check whether `access.admin` is defined on `Users.ts`.
- **Expected Result:**
  Customers (`role: 'customer'`) must receive HTTP 403 Forbidden / Access Denied when attempting to authenticate into the Payload CMS Admin Dashboard. Only `admin` and `staff` roles may enter.
- **Actual Result (Before Fix):**
  `Users.ts` defined `read`, `create`, `update`, `delete` access rules, but omitted `access.admin`. In Payload 3, omitting `access.admin` allows any authenticated user from the auth collection to access the admin UI.
- **Root Cause (Verified):**
  Missing `admin` predicate in `Users.access` config block.
- **Fix Applied:**
  Added explicit role-based admin restriction in [`src/collections/Users.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/collections/Users.ts):
  ```ts
  admin: ({ req: { user } }) => Boolean(user && (user.role === 'admin' || user.role === 'staff'))
  ```
- **Retest Result:**
  **PASS**. Verified unauthenticated users and customers receive `false`; admin and staff receive `true`.
- **Regression Tests:**
  [`tests/qa-users-admin-access.test.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/tests/qa-users-admin-access.test.ts) (5 automated subtests all passing).

---

### BUG-003 — Missing IP Rate Limiting on Authentication Login Endpoint
- **Severity / Priority:** **P1 / High** (Credential Stuffing & Brute Force Vulnerability)
- **Environment / Build:** Storefront Auth API
- **Route / API:** `POST /api/auth/login`
- **Related Test IDs:** `AUTH-012`, `SEC-008`
- **Preconditions:** Unauthenticated client attempting multiple rapid login requests.
- **Reproduction Steps:**
  1. Submit rapid failed login requests in an automated loop to `/api/auth/login`.
  2. Inspect response HTTP status code on 11th+ attempt.
- **Expected Result:**
  Endpoint should enforce rate limiting (e.g. 10 attempts per 15-minute sliding window) and return `HTTP 429 Too Many Requests`.
- **Actual Result (Before Fix):**
  Unlike `/api/checkout` and `/api/coupons/validate` which already implemented `checkRateLimit`, `/api/auth/login` had no rate limiting, allowing unlimited automated credential brute-force attacks.
- **Root Cause (Verified):**
  Lack of `checkRateLimit` invocation in [`src/app/(store)/api/auth/login/route.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/api/auth/login/route.ts).
- **Fix Applied:**
  Integrated sliding-window IP rate limiter into `POST /api/auth/login`:
  ```ts
  const clientIp = getClientIp(req)
  if (!checkRateLimit(`login_${clientIp}`, { limit: 10, windowMs: 15 * 60 * 1000 })) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in 15 minutes.' },
      { status: 429 }
    )
  }
  ```
- **Retest Result:**
  **PASS**. Requests exceeding the limit receive HTTP 429 with clear retry timing.
- **Regression Tests:**
  [`tests/qa-auth-rate-limit.test.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/tests/qa-auth-rate-limit.test.ts) (3 automated subtests all passing).

---

### BUG-004 — ESLint 9 FlatCompat Deprecated CLI Crash on `next lint`
- **Severity / Priority:** **P2 / Medium** (CI/CD Quality Gate Issue)
- **Environment / Build:** Node 22 / ESLint 9
- **Command:** `pnpm run lint` (`next lint`)
- **Reproduction Steps:**
  1. Execute `pnpm run lint`.
- **Expected Result:**
  Clean lint output without process crash.
- **Actual Result (Before Fix):**
  Crashed with: `Error: Failed to patch ESLint because the calling module was not recognized... Referenced from: eslint-config-next/core-web-vitals.js`.
- **Root Cause (Verified):**
  `eslint-config-next@15.5.28` includes legacy `@rushstack/eslint-patch/modern-module-resolution` which conflicts when invoked via `next lint` with ESLint 9 Flat Config.
- **Fix / Recommendation:**
  Migrate to native ESLint CLI with `eslint .` or adjust flat config compatibility.
