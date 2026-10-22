# LOVIXA COSMETIC — Senior QA Master Test Suite & Antigravity Execution Prompt

**Version:** 1.0  
**Date:** 2026-10-22  
**Scope:** Next.js storefront, Payload CMS admin, MongoDB Atlas, Cloudflare R2, WhatsApp manual-order checkout.  
**Status:** Test specifications only; no tests have been executed or passed.  
**Owner:** QA / Engineering

> **Important:** The repository is the source of truth. Verify actual features, requirements, route names, pricing, coupon rules, shipping, GST, login and checkout behavior before assuming they exist. Mark missing or unimplemented features as `NOT_IMPLEMENTED` / `NEEDS_DECISION`, not as a passing test. Never use live customer data, send real WhatsApp orders, or change production records without approval.

## 1. Test execution standards

For every test capture: `ID | Module | Preconditions | Steps | Input/Test Data | Expected | Actual | Status (PASS/FAIL/BLOCKED/NOT_RUN/NOT_IMPLEMENTED) | Severity | Evidence | Issue Link | Environment | Timestamp`.

Severity: **P0** security/privacy breach, wrong order amount, serious data loss, or checkout unusable; **P1** core journey broken; **P2** significant non-blocking issue; **P3** cosmetic. Prioritize according to actual impact.

Coverage layers: unit, component, integration, API, E2E, accessibility, visual/responsive, performance, security, SEO, admin/data, recovery, cross-browser. Test both positive and negative cases. All calculations must be validated on the server, not trusted from the browser.

### Suggested test matrix

- Viewports: 280, 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 2500 px.
- Browsers: Chromium/Chrome, Firefox, WebKit/Safari where supported; Android Chrome and iOS Safari manual/device checks.
- Network: normal, slow 3G/4G, offline, timeout, interrupted API, failed image request.
- Roles: guest, customer A, customer B, admin, unauthorized user.
- States: empty, loading, populated, error, out-of-stock, expired, unpublished, stale session, stale cart.

## 2. Test data and price rules

Reference *selling prices provided by owner* (confirm against current catalog): Rosemary Hair Oil ₹299; Rosemary & Methi Dana Shampoo ₹399; Combo ₹649. These are not verified live database values. Sample QA coupons (`QA10` 10%, `QA50` ₹50) are **fixtures only** and must not be created in production. Use known fixture stock, coupon usage limits, address, and test users. Determine whether listed prices are GST-inclusive and define exact tax, shipping, discount precedence, rounding and stacking policies before asserting totals. Example: combo 649, 10% off 64.90, free shipping → 584.10, **only if the confirmed rules permit this**.

## 3. Detailed functional test cases

Each table row is an executable scenario outline; convert it to automation with explicit setup, actions, assertions, teardown, and evidence. Expected behavior must match approved requirements.

### A. Homepage / navigation

| ID | Steps / scenario | Expected |
|---|---|---|
| HOME-001 | Open homepage as guest | Page loads without console/runtime errors |
| HOME-002 | Click logo from inner page | Returns to homepage |
| HOME-003 | Use header, footer and mobile menu links | Correct routes; no dead links |
| HOME-004 | Open and close mobile navigation | Focus/scroll behavior correct; no overlay defect |
| HOME-005 | Click hero and featured product CTAs | Correct target and relevant product |
| HOME-006 | Reload and directly open nested route | No routing/hydration error |
| HOME-007 | Verify banners/images via R2 | Assets load with appropriate fallback |
| HOME-008 | Simulate slow/offline page load | Loading/error/retry states usable |
| HOME-009 | Verify contact/about/policy links | Content and navigation accurate |
| HOME-010 | Keyboard navigate navigation/menu | Visible focus and accessible controls |

### B. Authentication

| ID | Steps / scenario | Expected |
|---|---|---|
| AUTH-001 | Login with valid credentials | Authenticated, intended redirect |
| AUTH-002 | Login with wrong password | Secure generic error; no login |
| AUTH-003 | Login with unknown email | No account enumeration |
| AUTH-004 | Submit empty fields | Required validation |
| AUTH-005 | Submit malformed email | Invalid email rejected |
| AUTH-006 | Register duplicate email | Duplicate registration prevented |
| AUTH-007 | Toggle password visibility | Works without changing value |
| AUTH-008 | Refresh authenticated page | Session persists as designed |
| AUTH-009 | Logout then Back to protected page | Private content inaccessible |
| AUTH-010 | Expire/revoke session | Protected API and UI require reauth |
| AUTH-011 | Inject HTML/NoSQL operators in auth fields | No execution, injection or bypass |
| AUTH-012 | Rapid failed logins | Rate limit/abuse protection |
| AUTH-013 | Mobile keyboard/form errors | No clipping or overlap |
| AUTH-014 | Login from checkout | Returns to intended flow |
| AUTH-015 | Concurrent account A/B sessions | Correct isolation |
| AUTH-016 | Test password reset, if implemented | Token expiry, one-use, safe errors |
| AUTH-017 | Directly access admin with customer role | Forbidden |
| AUTH-018 | Check auth cookies/tokens | Secure attributes and no secret leakage |

### C. Catalog / product detail / media

| ID | Steps / scenario | Expected |
|---|---|---|
| PROD-001 | Open catalog | Active/published products shown |
| PROD-002 | Load R2 product images | Correct images, responsive sizes |
| PROD-003 | Compare name, SKU, prices and MRP to CMS | Accurate and consistently formatted |
| PROD-004 | Open each product card | Correct product detail |
| PROD-005 | Attempt out-of-stock purchase | Blocked with clear message |
| PROD-006 | Access disabled/unpublished product | Not purchasable; access per policy |
| PROD-007 | Check ingredients, description, volume | Matches approved CMS data |
| PROD-008 | Open invalid slug | Proper 404/no crash |
| PROD-009 | Refresh product detail | Data remains correct |
| PROD-010 | Change test product price in staging admin | Storefront/cache reflects update as designed |
| PROD-011 | Force R2/image failure | Useful placeholder and no layout collapse |
| PROD-012 | Test long title and translated characters | No overflow/XSS |
| PROD-013 | Inspect product metadata/canonical/schema | Correct and unique |
| PROD-014 | Attempt quantity outside bounds | Rejected in UI and API |
| PROD-015 | Modify price in client request | Server ignores/rejects tampering |
| PROD-016 | Navigate image gallery/zoom, if present | Controls accessible and accurate |
| PROD-017 | Verify combo SKU and bundle contents | Correct constituent products and price |
| PROD-018 | Concurrent catalog updates | No inconsistent final checkout |

### D. Search, filter and sort

| ID | Steps / scenario | Expected |
|---|---|---|
| SEARCH-001 | Search exact product name | Relevant results |
| SEARCH-002 | Search partial/case-insensitive term | Expected matches |
| SEARCH-003 | Search unknown term | Clear empty state |
| SEARCH-004 | Search special characters/HTML | Safe handling |
| SEARCH-005 | Combine category and price filters | Intersection correctly applied |
| SEARCH-006 | Reset filters | Original catalog restored |
| SEARCH-007 | Sort price low-to-high/high-to-low | Numeric ordering correct |
| SEARCH-008 | Change sort after filters | Both retained consistently |
| SEARCH-009 | Refresh/share filtered URL | State preserved as designed |
| SEARCH-010 | Rapidly change search terms | No stale result overwrite |
| SEARCH-011 | Pagination/load more, if implemented | No duplicates or missing items |
| SEARCH-012 | Search on mobile | Input and results usable |

### E. Cart

| ID | Steps / scenario | Expected |
|---|---|---|
| CART-001 | Add one item | Correct cart line |
| CART-002 | Add same SKU twice | Quantity merges per rule |
| CART-003 | Increase quantity | Accurate subtotal |
| CART-004 | Decrease quantity | Accurate subtotal |
| CART-005 | Remove item | Item removed; totals recalc |
| CART-006 | Remove final item | Empty state and no checkout |
| CART-007 | Refresh page | Cart persistence per policy |
| CART-008 | Open/close drawer | No focus, scroll, layering issues |
| CART-009 | Add multiple distinct items | Correct line and aggregate totals |
| CART-010 | Send zero/negative/noninteger quantity | Server rejects |
| CART-011 | Exceed stock/limit | Server rejects; clear UI |
| CART-012 | Admin changes price after cart creation | Checkout uses authoritative current price |
| CART-013 | Guest logs in with cart | Defined merge policy; no loss/duplication |
| CART-014 | Double click Add to Cart | No unintended duplicates |
| CART-015 | Simulate cart API failure | No false success; recoverable |
| CART-016 | Two tabs edit same cart | Consistent conflict behavior |
| CART-017 | Add unpublished/deleted product via API | Rejected |
| CART-018 | Verify cart after logout/account switch | No private data leakage |

### F. Wishlist

| ID | Steps / scenario | Expected |
|---|---|---|
| WISH-001 | Add item to wishlist | Saved and icon updated |
| WISH-002 | Remove item | Removed consistently |
| WISH-003 | Add same item repeatedly | No duplicates |
| WISH-004 | Refresh | Persistence as designed |
| WISH-005 | Logout/login | Correct user-specific state |
| WISH-006 | Move/add wishlisted item to cart | Correct SKU and quantity |
| WISH-007 | Delete product from CMS | Graceful unavailable state |
| WISH-008 | Guest wishlist | Follows explicit guest policy |
| WISH-009 | Attempt to read another user's wishlist | Access denied |
| WISH-010 | Tap heart on narrow mobile | Usable touch target and feedback |
| WISH-011 | API failure during toggle | UI rolls back/recovers |
| WISH-012 | Rapid toggle across tabs | Final state consistent |

### G. Coupons, discounts and pricing

| ID | Steps / scenario | Expected |
|---|---|---|
| COUP-001 | Apply active eligible coupon | Correct discount |
| COUP-002 | Apply invalid code | Clear rejection |
| COUP-003 | Apply expired coupon | Rejected |
| COUP-004 | Apply future-start coupon | Rejected |
| COUP-005 | Below minimum basket | Rejected |
| COUP-006 | Exactly at minimum threshold | Correct boundary behavior |
| COUP-007 | Percentage discount | Accurate currency rounding |
| COUP-008 | Fixed-value discount | Correct capped application |
| COUP-009 | Percentage with max discount cap | Cap enforced |
| COUP-010 | Exceed per-user usage limit | Rejected |
| COUP-011 | Excluded product/category | Rejected or excluded correctly |
| COUP-012 | Remove coupon | Total recalculated |
| COUP-013 | Reduce cart after coupon | Eligibility rechecked |
| COUP-014 | Coupon with case/whitespace | Normalization per rule |
| COUP-015 | Double-submit coupon | Discount applied once |
| COUP-016 | Coupon expires before checkout | Revalidated server-side |
| COUP-017 | Attempt multiple coupon stacking | Approved stacking rule enforced |
| COUP-018 | Apply coupon to combo | Approved combo eligibility enforced |
| COUP-019 | Tamper coupon amount/client total | Server ignores/rejects |
| COUP-020 | Last remaining redemption from two sessions | Atomic limit enforcement |
| COUP-021 | Discount greater than subtotal | Never negative payable amount |
| COUP-022 | Free-shipping coupon | Shipping and threshold correct |
| COUP-023 | GST inclusive/exclusive discount treatment | Matches approved tax rules |
| COUP-024 | Discount order with shipping and bundles | Deterministic documented precedence |
| COUP-025 | Floating-point edge cases | Exact decimal/minor-unit calculation |
| COUP-026 | Delete/disable coupon in CMS | No longer usable after revalidation |

### H. Checkout, address and orders

| ID | Steps / scenario | Expected |
|---|---|---|
| CHECK-001 | Submit valid customer details | Moves to valid order review |
| CHECK-002 | Leave mandatory field blank | Inline accessible validation |
| CHECK-003 | Invalid Indian phone number | Rejected per validated rules |
| CHECK-004 | Invalid PIN/postal code | Rejected per shipping policy |
| CHECK-005 | Long address | Accepted within limit; no overflow |
| CHECK-006 | Leading/trailing spaces | Normalized safely |
| CHECK-007 | Names with punctuation/Unicode | Supported safely |
| CHECK-008 | Navigate back to cart | Items and selections retained |
| CHECK-009 | Double-click checkout action | Idempotent order draft/reference |
| CHECK-010 | Stock depleted at final submit | Cannot order unavailable item |
| CHECK-011 | Coupon invalidates during checkout | Recomputed and user notified |
| CHECK-012 | Refresh checkout | Valid recovery/no duplicate |
| CHECK-013 | Checkout API timeout | Safe retry without duplicate |
| CHECK-014 | Guest checkout | Follows approved requirement |
| CHECK-015 | Mobile keyboard, autofill and scroll | Form remains usable |
| CHECK-016 | Shipping destination outside service area | Correct block/message |
| CHECK-017 | Tamper cart ID, address or amount | Authorization and recalculation |
| CHECK-018 | Check order status transitions | No premature paid/confirmed status |
| CHECK-019 | Browser Back after handoff | No accidental resubmission |
| CHECK-020 | Address and order data retention | Privacy and access controls |

### I. WhatsApp handoff — critical

| ID | Steps / scenario | Expected |
|---|---|---|
| WA-001 | Click final WhatsApp order CTA | Opens configured merchant chat |
| WA-002 | Verify product name | Exact approved item name |
| WA-003 | Verify quantity | Matches checkout |
| WA-004 | Verify unit price | Authoritative current price |
| WA-005 | Apply coupon | Correct code/discount in message |
| WA-006 | Verify payable total | Exactly matches validated checkout |
| WA-007 | Verify name, phone, address | Correct and consented details |
| WA-008 | Add several items | Every line present; correct totals |
| WA-009 | Use `&`, `+`, newline, Unicode | URL encoded safely; readable message |
| WA-010 | WhatsApp installed | Correct app handoff |
| WA-011 | WhatsApp unavailable | Browser/fallback guidance |
| WA-012 | Popup/navigation blocked | Manual link fallback |
| WA-013 | Double-click CTA | No duplicate server-side drafts |
| WA-014 | Merchant number misconfigured | Detect configuration failure |
| WA-015 | Open WhatsApp but do not send | NOT marked received/confirmed |
| WA-016 | Cancel/close WhatsApp | NOT marked received/confirmed |
| WA-017 | Large order message | No silent truncation; clear handling |
| WA-018 | Change price in client payload | Server-generated amount prevails |
| WA-019 | Test Android/iOS/desktop URL behavior | Valid cross-platform handoff |
| WA-020 | Compare order reference with draft | Exact match, if draft exists |
| WA-021 | WhatsApp URL generated on server/client | No exposed secrets or open redirect |
| WA-022 | Click tracking/analytics | Handoff click != confirmed sale |
| WA-023 | Retry after connection loss | No duplicated order references |
| WA-024 | Check currency formatting | ₹ and decimal precision correct |
| WA-025 | Message content privacy | No tokens, admin info or unnecessary PII |

**Non-negotiable:** Opening a `wa.me` / click-to-chat link does **not** prove the customer sent the message or that the merchant received it. Without an approved receipt/confirmation mechanism, use `DRAFT` or `WHATSAPP_OPENED`, never `CONFIRMED` or `PAID` based solely on the redirect.

### J. Profile, order history and admin integration

| ID | Steps / scenario | Expected |
|---|---|---|
| ACCOUNT-001 | Open profile as authenticated user | Correct user data |
| ACCOUNT-002 | Open profile as guest | Redirect/deny |
| ACCOUNT-003 | Update profile fields | Validation and persistence |
| ACCOUNT-004 | Open another user's order URL | Forbidden |
| ACCOUNT-005 | Show order history if implemented | Correct user-only orders |
| ADMIN-001 | Create draft product | Not public until published |
| ADMIN-002 | Publish product | Visible after expected revalidation |
| ADMIN-003 | Update price | Catalog/cart/checkout synchronized |
| ADMIN-004 | Update stock | Correct availability enforcement |
| ADMIN-005 | Disable product | Purchase blocked |
| ADMIN-006 | Create/disable coupon in staging | Storefront follows new rules |
| ADMIN-007 | Upload valid image to R2 | Correct stored/retrievable media |
| ADMIN-008 | Upload forbidden file or oversized media | Rejected securely |
| ADMIN-009 | Customer role accesses admin endpoint | Forbidden |
| ADMIN-010 | Concurrent admins edit stock | Consistent final state |
| ADMIN-011 | R2 failure during upload | No broken/orphaned published media |
| ADMIN-012 | DB temporarily unavailable | Clear failure, no partial corruption |

### K. Responsive UI and accessibility

| ID | Steps / scenario | Expected |
|---|---|---|
| UI-001 | Test at 280–375 px | No horizontal overflow |
| UI-002 | Test 390–430 px | Correct mobile layout |
| UI-003 | Test 768 px | Tablet layout works |
| UI-004 | Test 1024 px | Laptop navigation works |
| UI-005 | Test 1440 px | Balanced desktop spacing |
| UI-006 | Test 1920–2500 px | No stretched/awkward layout |
| UI-007 | Compare product cards | Readable consistent grid |
| UI-008 | Open cart drawer | No clipped action/buttons |
| UI-009 | Open login modal | Proper focus trap/close behavior |
| UI-010 | Trigger loading/skeleton | Low layout shift |
| UI-011 | Trigger form error | Readable error, linked to field |
| UI-012 | Navigate only with keyboard | All critical actions possible |
| UI-013 | Inspect labels and semantics | Screen-reader-friendly controls |
| UI-014 | Inspect image alt text | Meaningful decorative/content treatment |
| UI-015 | Check text/control contrast | WCAG 2.2 AA target |
| UI-016 | Zoom to 200% | No loss of essential content |
| UI-017 | Test dark/high-contrast preference | Readable, no hidden controls |
| UI-018 | Simulate slow network | Useful loading and error states |
| UI-019 | Test Chrome/Firefox/WebKit | Critical paths work |
| UI-020 | Scroll with sticky header/footer | No overlap |
| UI-021 | Reduce motion setting | Animations respect preference |
| UI-022 | Tap targets on mobile | Buttons easy to activate |
| UI-023 | Check focus after route changes | Logical focus management |
| UI-024 | Rotate mobile portrait/landscape | Stable layout |

### L. Security, API and database

| ID | Steps / scenario | Expected |
|---|---|---|
| SEC-001 | Request another user's records | Denied |
| SEC-002 | Call Payload admin without authorization | Denied |
| SEC-003 | Tamper product price in API payload | Rejected/recalculated |
| SEC-004 | Tamper coupon amount | Rejected/recalculated |
| SEC-005 | Submit NoSQL injection payload | No query injection |
| SEC-006 | Submit XSS in address/name/search | Encoded; no execution |
| SEC-007 | CSRF test on state-changing requests | Appropriate CSRF/origin defense |
| SEC-008 | Burst auth/cart/checkout requests | Rate limits/abuse control |
| SEC-009 | Inspect client bundle/build artifacts | No server secrets leaked |
| SEC-010 | Attempt unauthorized R2 upload | Denied |
| SEC-011 | Upload invalid file type/size | Denied and safely logged |
| SEC-012 | Drop MongoDB connection in staging | Graceful handling/recovery |
| SEC-013 | Race stock changes | No invalid stock mutation |
| SEC-014 | Retry identical order request | Idempotency as designed |
| SEC-015 | Call privileged admin API as customer | Forbidden |
| SEC-016 | Expire/rotate session | Old token invalid |
| SEC-017 | Review logs/errors | No unnecessary PII/secrets |
| SEC-018 | Apply coupon via direct API | Server eligibility enforced |
| SEC-019 | Order unpublished product via direct API | Rejected |
| SEC-020 | Send malformed JSON/invalid types | Safe 4xx errors |
| SEC-021 | Test security headers/CSP | Appropriate configured protections |
| SEC-022 | Test CORS with untrusted origin | No unauthorized credentialed access |
| SEC-023 | Test mass assignment on user/order fields | Protected fields cannot be overwritten |
| SEC-024 | Test ID enumeration | Access controlled regardless of ID |
| SEC-025 | Check webhook endpoints if any | Authenticated, replay-resistant |
| SEC-026 | Check dependency vulnerabilities | Document and remediate verified issues |

### M. SEO, performance, resilience, analytics

| ID | Steps / scenario | Expected |
|---|---|---|
| SEO-001 | Inspect title/description per route | Unique, relevant metadata |
| SEO-002 | Inspect canonical and robots directives | Correct indexing rules |
| SEO-003 | Inspect sitemap | Valid canonical public URLs |
| SEO-004 | Validate Product structured data | Matches visible price/availability |
| SEO-005 | Inspect 404/unpublished pages | Correct status and indexing |
| SEO-006 | Inspect OG/social metadata | Correct previews |
| PERF-001 | Run Lighthouse on key routes | Record actual metrics and budgets |
| PERF-002 | Check LCP, INP, CLS | Meet agreed Core Web Vitals targets |
| PERF-003 | Check image sizes/lazy loading | Appropriate optimization |
| PERF-004 | Inspect duplicate API requests | Avoid unintended redundant calls |
| PERF-005 | Simulate API timeout | Clear retry/error handling |
| PERF-006 | Simulate R2 image outage | Graceful fallback |
| PERF-007 | Simulate database failure | No false checkout success |
| PERF-008 | Verify no hydration/runtime errors | Clean key routes |
| ANALYTICS-001 | Add-to-cart event | Fires once per intended action |
| ANALYTICS-002 | WhatsApp click event | Recorded as handoff, not paid order |
| ANALYTICS-003 | Consent/privacy check | No excessive PII sent to analytics |

## 4. High-priority end-to-end scenarios

| Flow ID | Steps | Required assertions |
|---|---|---|
| E2E-001 | Guest → home → product → cart → address → WhatsApp | Correct item, quantity, total, recipient, encoded text |
| E2E-002 | Register/login → wishlist → cart → checkout | Persistence and correct account isolation |
| E2E-003 | Add oil + shampoo → edit quantities → coupon → WhatsApp | Server total equals UI and message |
| E2E-004 | Add combo → discount → shipping → handoff | Bundle/discount/tax/shipping precedence correct |
| E2E-005 | Coupon expires after cart | Checkout rejects/reprices safely |
| E2E-006 | Price/stock changes between cart and checkout | User notified; no stale price/stock purchase |
| E2E-007 | Open WhatsApp then cancel | No fake order confirmation |
| E2E-008 | User A → logout → User B | No wishlist/cart/order data leak |
| E2E-009 | Mobile 320px → cart → checkout | All critical actions usable |
| E2E-010 | R2/API/DB failure during journey | Safe failure and recovery |
| E2E-011 | Repeated checkout clicks/retries | No duplicate order drafts |
| E2E-012 | Admin updates product and coupon in staging | Storefront reflects correct values |

## 5. Bug reporting template

```md
### BUG-XXX — Concise title
- Severity / priority: P0 / P1 / P2 / P3
- Environment / build / commit:
- Route / viewport / browser:
- Preconditions:
- Reproduction steps:
  1.
  2.
  3.
- Expected result:
- Actual result:
- Evidence: screenshot/video/trace/log (redacted)
- Root cause (only if verified):
- Fix / commit:
- Retest result:
- Regression tests:
```

## 6. Definition of done / release gates

1. No unresolved P0 defects; no unresolved P1 defects in authentication, cart, checkout, pricing, order handoff, privacy, security.
2. All required critical E2E flows PASS with actual evidence in staging.
3. UI and API totals agree under documented tax/discount/shipping rules.
4. No false WhatsApp `SENT`, `RECEIVED`, `CONFIRMED`, or `PAID` claims.
5. Cross-browser, mobile, accessibility, SEO, performance, and security results documented; agreed budgets met or exceptions approved.
6. Automated test suites run clean in CI; flaky tests tracked, not silently ignored.
7. Admin, database, R2 and environment configurations verified without exposing credentials.
8. Final QA report lists actual pass/fail/blocked/not-run counts and residual risks. Never invent pass results or a “100% quality” claim.

---

# 7. COPY-PASTE MASTER PROMPT FOR GOOGLE ANTIGRAVITY

```text
Act as a Principal QA Architect, Senior SDET, Application Security Reviewer, and Senior Next.js/Payload CMS Engineer with 10–15+ years of production experience.

PROJECT: LOVIXA COSMETIC e-commerce website.
EXPECTED STACK (VERIFY IN REPOSITORY): Next.js frontend, Payload CMS backend/admin, MongoDB Atlas, Cloudflare R2 media, WhatsApp click-to-chat/manual-payment order flow. Do not assume features or endpoints exist without inspecting the code.

TASK:
Read the entire attached `LOVIXA_QA_MASTER_TEST_CASES_AND_ANTIGRAVITY_PROMPT.md` file. Perform a comprehensive repository-driven QA audit and, where safely possible, implement and execute automated tests for ALL listed scenarios. Evaluate both UI behavior and server-side business logic. Do not merely generate a report or mark cases PASS without running them.

MANDATORY WORKFLOW:
1. INVENTORY FIRST: Inspect package manifests, app routes, components, Payload collections/access rules/hooks, APIs/server actions, authentication, cart/wishlist storage, coupon calculations, checkout/order lifecycle, WhatsApp URL builder, MongoDB models, R2 storage adapter, deployment config and existing tests. Produce a feature-to-test traceability matrix. Mark each case IMPLEMENTED / NOT_IMPLEMENTED / NEEDS_DECISION / NOT_APPLICABLE with evidence. Ask me for missing business rules rather than guessing.
2. SAFETY: Work in a dedicated branch. Preserve the current UI, design system, product labels, business rules, existing features and data. Never delete production data or run destructive migrations. Never use real customer PII, real coupon redemptions, live WhatsApp sends, or production admin modifications. Use isolated staging/test DB, mock R2 and WhatsApp, fixtures and disposable accounts. Never print `.env` secrets, tokens or credentials. Request approval before any production-affecting operation.
3. BASELINE: Install dependencies using the repository's lockfile/package manager. Run existing lint, typecheck, build and test scripts; capture baseline results. Inspect runtime warnings, hydration issues, failed network calls, dead links, stale cache and duplicate API calls. Do not hide baseline failures.
4. TEST ARCHITECTURE: Reuse existing frameworks if present; otherwise propose Playwright for browser E2E, the project's compatible unit/integration runner (Vitest/Jest as appropriate), API contract/integration tests, axe-core for accessibility, Lighthouse for performance, and dependency/static security checks. Configure safe test environments, seeded fixtures, deterministic time and network mocking, isolated test data, teardown, CI scripts, screenshots/traces on failure. Avoid adding unnecessary dependencies.
5. EXECUTE: Implement prioritized test automation for every applicable ID in the attached document. Start with AUTH, PROD, CART, COUP, CHECK, WA, SEC and E2E, then wishlist/search/admin/UI/SEO/performance. Run tests and record each test's real status: PASS, FAIL, BLOCKED, NOT_RUN, NOT_IMPLEMENTED or NOT_APPLICABLE. If browser/device/credentials/network is unavailable, state BLOCKED and exactly why; do not fake execution.
6. VERIFY MONEY: Determine actual tax-inclusive/exclusive rules, shipping policy, coupon eligibility/stacking, stock constraints and rounding from code + approved requirements. Independently compute expected totals with integer minor units or a suitable decimal implementation. Compare catalog, cart, checkout, server-generated order and WhatsApp prefilled text. Reject tampered client prices, quantities, coupon amounts and totals. Test concurrency and double-submit/idempotency.
7. WHATSAPP INVARIANT: Opening a WhatsApp URL only proves a handoff attempt. It does not prove the user sent the message or the merchant received it. Do not mark the order CONFIRMED, SENT, RECEIVED or PAID without an actual reliable confirmation mechanism. Test message encoding, merchant number, every line item, final total, customer data, mobile/desktop fallbacks and cancellation.
8. SECURITY: Review Payload access controls and API authorization, auth/session, CSRF/CORS where applicable, XSS/NoSQL injection, mass assignment, user isolation, rate limiting, secret leakage, R2 upload permissions and order/customer privacy. Use non-destructive security tests only. No active attack or intrusive load test against production.
9. FIX SAFELY: For each verified defect, first record reproduction steps and a failing regression test. Apply the smallest safe fix; preserve existing layout, functionality and architecture. Rerun relevant tests plus full regression. Separate test-only improvements from production code fixes. Never make sweeping rewrites without my approval. If requirements are ambiguous, add a NEEDS_DECISION item instead of silently choosing behavior.
10. RESPONSIVENESS: Verify actual layouts at 280, 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920 and 2500 px, including cart drawer, checkout forms, menu, wishlist and product details. Check accessibility, focus, keyboard, contrast, zoom and overflow. Save visual evidence of failures.
11. REPORT: Create/maintain:
   - `qa/reports/FEATURE_INVENTORY.md`
   - `qa/reports/TEST_CASE_EXECUTION.md` (every ID, status, evidence)
   - `qa/reports/BUG_REPORT.md` (severity, reproduction, expected/actual, root cause if proven, fix, retest)
   - `qa/reports/SECURITY_REVIEW.md` (redacted)
   - `qa/reports/RESPONSIVE_ACCESSIBILITY.md`
   - `qa/reports/PERFORMANCE_SEO.md`
   - `qa/reports/RELEASE_READINESS.md` (pass/fail/blocked/not-run, open P0/P1, GO/NO-GO with rationale)
   - test automation code/config in existing appropriate test directories.
12. FINISH: Provide exact commands to rerun each suite locally and in CI, what was executed vs not executed, what was fixed, what still needs my decision, and a prioritized next-action list. A 100% PASS claim is forbidden unless every applicable case was genuinely run and passed. If execution cannot happen, say so clearly and provide the executable suite and blockers.

START NOW WITH REPOSITORY INVENTORY AND BASELINE, THEN PROCEED THROUGH THE TEST MATRIX IN PRIORITY ORDER. Do not stop after producing only a checklist. Do not claim success without evidence.
```

## 8. How to use

1. Place this file in your repository root or `qa/` folder.
2. Open the project in Antigravity and paste the **Master Prompt** above; tell it the exact Markdown file path.
3. Review any business-rule questions and authorize staging-only changes.
4. Require actual test artifacts and the release-readiness report before deployment.

**This document is a QA specification, not an executed audit.**
