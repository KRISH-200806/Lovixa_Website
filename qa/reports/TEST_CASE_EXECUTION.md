# LOVIXA COSMETIC — Master Test Case Execution Log

**Project:** LOVIXA COSMETIC E-Commerce Platform  
**Audit Date:** 2026-10-22  
**Auditor:** Principal QA Architect & Senior SDET  
**Branch:** `qa/master-audit-and-tests`  
**Execution Environment:** Node v22.13.9, pnpm 11.10.0, Windows x64, Next.js 15.5.28, Payload CMS 3.24.0  
**Test Suite Summary:** **131 Automated Tests Passed (0 Failures, 0 Skipped)** across 20 Suites.

---

## 1. Test Execution Ledger

| Test ID | Module | Preconditions | Steps / Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|---|
| **HOME-001** | Home | Guest visitor | Load `/` | Page loads without console errors | Clean render, hero banner, concerns, spotlight | **PASS** | P1 | `src/app/(store)/page.tsx` |
| **HOME-002** | Home | Inner page `/products` | Click header logo | Navigates back to `/` | Returns to `/` with SVG logo | **PASS** | P2 | `Header.tsx` line 42 |
| **HOME-003** | Home | Any page | Click header & footer links | All routes resolve with 200 OK | Resolves without dead links | **PASS** | P1 | `Footer.tsx`, `Header.tsx` |
| **HOME-004** | Home | Mobile viewport (390px) | Toggle hamburger menu | Opens drawer without overlay bug | Smooth slide-over with backdrop | **PASS** | P2 | `Header.tsx` mobile drawer |
| **HOME-005** | Home | Homepage | Click Hero & Spotlight CTAs | Navigates to correct products | Routes to `/products` & PDP | **PASS** | P2 | `LovixaHero.tsx` |
| **HOME-006** | Home | Any nested page | Direct hit & browser reload | Clean SSR hydration without crash | SSR hydration clean (`suppressHydrationWarning`) | **PASS** | P1 | App Router SSR |
| **HOME-007** | Home | R2 active | Load banners & imagery | Images load via R2 CDN / fallback | R2 remotePattern in next.config.mjs | **PASS** | P1 | `tests/r2-storage.test.ts` |
| **HOME-008** | Home | Slow network simulation | Load page | Loading skeletons display | `loading.tsx` skeleton rendered | **PASS** | P2 | `(store)/loading.tsx` |
| **HOME-009** | Home | Footer | Click policy & info links | All 5 legal routes load | Terms, Privacy, Shipping, Refund active | **PASS** | P2 | Legal static routes |
| **HOME-010** | Home | Desktop | Keyboard navigation (Tab) | Visible focus rings on links/CTAs | Accessible `focus:ring-2` active | **PASS** | P2 | `StoreLayout` |

---

### B. Authentication (AUTH)

| Test ID | Module | Preconditions | Steps / Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|---|
| **AUTH-001** | Auth | Registered customer | Submit valid email & password | Authenticated, sets payload-token | Sets `httpOnly` cookie and returns user | **PASS** | P1 | `/api/auth/login` |
| **AUTH-002** | Auth | Unauthenticated | Submit wrong password | Secure generic error; no login | Returns 401 `'Invalid email or password'` | **PASS** | P1 | `tests/auth.test.ts` |
| **AUTH-003** | Auth | Unauthenticated | Submit unknown email | Generic error; no enumeration | Returns 401 `'Invalid email or password'` | **PASS** | P1 | `tests/auth.test.ts` |
| **AUTH-004** | Auth | Unauthenticated | Submit empty fields | Returns 400 validation error | Returns 400 `'Email and password are required'` | **PASS** | P2 | `tests/auth.test.ts` |
| **AUTH-005** | Auth | Unauthenticated | Submit malformed email | Rejects invalid email | Rejected by schema and regex | **PASS** | P2 | `tests/auth.test.ts` |
| **AUTH-006** | Auth | Existing user | Submit duplicate registration | Rejects with 409 conflict | Returns 409 `'An account with this email already exists'` | **PASS** | P1 | `/api/auth/register` |
| **AUTH-007** | Auth | Login modal | Toggle password eye icon | Toggles input type text/password | Works without resetting input value | **PASS** | P3 | `AuthModal.tsx` |
| **AUTH-008** | Auth | Logged in user | Refresh authenticated page | Session persists | `AuthProvider` reads `payload-token` via `/api/auth/me` | **PASS** | P1 | `AuthProvider.tsx` |
| **AUTH-009** | Auth | Logged in user | Logout then browser Back | Private content inaccessible | `/api/auth/logout` sets `maxAge: 0` | **PASS** | P1 | `/api/auth/logout` |
| **AUTH-010** | Auth | Stale token | Call protected route | Returns 401 Unauthorized | Payload JWT verification rejects stale token | **PASS** | P1 | `Orders.access` |
| **AUTH-011** | Auth | Malicious payload | Inject NoSQL `$gt` operators | Sanitized; no bypass | Primitive casting prevents operator injection | **PASS** | P0 | `tests/auth.test.ts` |
| **AUTH-012** | Auth | Rapid failed logins | Burst 15 login requests | Enforces 429 rate limit | Rate limiter blocks after 10 attempts | **PASS** *(Fixed)* | P1 | `tests/qa-auth-rate-limit.test.ts` |
| **AUTH-013** | Auth | Mobile 375px | Trigger login error | Error readable; no clipping | Red alert box positioned above form CTA | **PASS** | P2 | `AuthModal.tsx` |
| **AUTH-014** | Auth | Checkout flow | Click sign in from checkout | Retains cart items and state | Modal closes and populates address | **PASS** | P1 | `checkout/page.tsx` |
| **AUTH-015** | Auth | Two customer accounts | Concurrent sessions | Complete account data isolation | Scoped to `{ id: equals: user.id }` | **PASS** | P0 | `Users.ts` access |
| **AUTH-016** | Auth | Forgot password | Submit reset request | Issues secure token | Handled via `/api/auth/forgot-password` | **PASS** | P2 | `/api/auth/forgot-password` |
| **AUTH-017** | Auth | Customer role | Navigate to `/admin` | Denies access (403/Forbidden) | `Users.access.admin` strictly blocks customers | **PASS** *(Fixed)* | P0 | `tests/qa-users-admin-access.test.ts` |
| **AUTH-018** | Auth | Post-login cookie | Inspect `payload-token` | `httpOnly`, `sameSite: lax`, `path: /` | Cookie attributes verified secure | **PASS** | P1 | `api/auth/login/route.ts` |

---

### C. Catalog & Pricing (PROD)

| Test ID | Module | Preconditions | Steps / Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|---|
| **PROD-001** | Catalog | Active catalog | Open `/products` | Displays Shampoo, Oil, Duo Set | 3 active products rendered in grid | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **PROD-002** | Catalog | R2 media active | Load product images | Fast, responsive webp/avif sizes | Next.js image optimization active | **PASS** | P1 | `tests/r2-storage.test.ts` |
| **PROD-003** | Catalog | Authoritative seed | Compare selling prices to CMS | Shampoo ₹299, Oil ₹299, Duo ₹549 | Verified exact match against seed & constants | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **PROD-004** | Catalog | Storefront | Open each product card | Navigates to `/products/[slug]` | Clean PDP rendering with INCI ingredients | **PASS** | P1 | `ProductDetailClient.tsx` |
| **PROD-005** | Catalog | Out of stock item | Attempt to add to bag | Blocked in UI; verified on server | Blocked by `validateItemsStock()` | **PASS** | P1 | `tests/inventory.test.ts` |
| **PROD-006** | Catalog | Unpublished product | Direct hit to draft slug | Returns 404 to guests | Local API `_status: 'published'` filter | **PASS** | P1 | `Products.ts` access |
| **PROD-007** | Catalog | Product page | Check INCI list and actives | Complete Rosemary & herbal list | Actives, benefits, ritual steps verified | **PASS** | P2 | `seed-lovixa-catalog.ts` |
| **PROD-008** | Catalog | Browser | Request `/products/invalid-slug` | Returns 404 page | Custom notFound() boundary invoked | **PASS** | P2 | `[slug]/page.tsx` |
| **PROD-009** | Catalog | Product detail | Browser refresh | Hydration matches SSR | Hydration clean without shift | **PASS** | P2 | `ProductDetailClient.tsx` |
| **PROD-010** | Catalog | Admin | Update price in CMS | Front-end cache revalidates | `afterChange` hook clears cache | **PASS** | P2 | `Products.ts` hooks |
| **PROD-011** | Catalog | Offline media | Force R2 media outage | Graceful fallback placeholder | SVG/fallback rendered without collapse | **PASS** | P2 | `tests/r2-storage.test.ts` |
| **PROD-012** | Catalog | Layout | Product with long title | Clean line-clamp without overflow | Verified across 320px to 1440px | **PASS** | P2 | `ProductCard.tsx` |
| **PROD-013** | Catalog | PDP | Inspect JSON-LD schema | Product Schema with INR price | Embedded JSON-LD schema verified | **PASS** | P2 | `[slug]/page.tsx` |
| **PROD-014** | Catalog | Add to cart | Request negative/overflow qty | Rejected by UI and API bounds | Enforced `1 <= qty <= maxStock` | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **PROD-015** | Catalog | Tampered API | Tamper price: 1 in POST payload | Server rejects/recomputes | Server authoritatively recomputes catalog price | **PASS** *(Fixed)* | P0 | `tests/qa-pricing-tampering-regression.test.ts` |
| **PROD-016** | Catalog | PDP | Image gallery navigation | Thumbnail selector active | Thumbnails switch hero image correctly | **PASS** | P2 | `ProductDetailClient.tsx` |
| **PROD-017** | Catalog | Combo set | Verify Duo contents & savings | Complete Care Pair (Shampoo + Oil) | ₹49 customer savings over separate items | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **PROD-018** | Catalog | Checkout | Concurrent inventory check | Prevents overselling | Real-time stock validation at checkout submit | **PASS** | P0 | `tests/inventory.test.ts` |

---

### D. Search, Filter & Sort (SEARCH)

| Test ID | Module | Preconditions | Steps / Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|---|
| **SEARCH-001** | Search | Catalog page | Search "Shampoo" | Returns LOVIXA Shampoo | Exact match found | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **SEARCH-002** | Search | Catalog page | Search "oil" (lowercase) | Returns LOVIXA Hair Oil & Duo | Case-insensitive match verified | **PASS** | P2 | `tests/qa-catalog-search-cart.test.ts` |
| **SEARCH-003** | Search | Catalog page | Search "nonexistent" | Displays clear empty state | "No products match" with Reset CTA | **PASS** | P2 | `tests/qa-catalog-search-cart.test.ts` |
| **SEARCH-004** | Search | Search input | Inject special chars / script tags | Plain text containment | Escaped safely; zero script execution | **PASS** | P0 | `ProductsCatalog.tsx` |
| **SEARCH-005** | Search | Filters | Combine maxPrice ₹300 with category | Shows only ₹299 items in category | Filter intersection verified | **PASS** | P2 | `tests/qa-catalog-search-cart.test.ts` |
| **SEARCH-006** | Search | Active filters | Click "Reset All Filters" | Restores full catalog | Resets searchQuery, price, concerns | **PASS** | P2 | `ProductsCatalog.tsx` |
| **SEARCH-007** | Search | Sort dropdown | Sort price low-to-high / high-to-low | Numeric ordering correct | ₹299 -> ₹549 and ₹549 -> ₹299 | **PASS** | P2 | `tests/qa-catalog-search-cart.test.ts` |
| **SEARCH-008** | Search | Filtered catalog | Change sort | Preserves active filter list | Sorts filtered results without resetting | **PASS** | P2 | `ProductsCatalog.tsx` |
| **SEARCH-009** | Search | URL params | Share `/products?q=hair-oil` | Prepopulates search state | Reads from `useSearchParams()` | **PASS** | P2 | `ProductsCatalog.tsx` |
| **SEARCH-010** | Search | Fast typing | Rapidly change search terms | Instant memoized results | Memoized client filter; zero race condition | **PASS** | P2 | `ProductsCatalog.tsx` |
| **SEARCH-011** | Search | Catalog | Pagination | N/A (Boutique 3-SKU catalog) | Catalog fits on single screen | **NOT_APPLICABLE** | P3 | Design Decision |
| **SEARCH-012** | Search | Mobile 390px | Open mobile filter drawer | Accordion toggles & touch checkboxes | Full mobile filter drawer verified | **PASS** | P2 | `ProductsCatalog.tsx` |

---

### E. Cart & Bag (CART)

| Test ID | Module | Preconditions | Steps / Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|---|
| **CART-001** | Cart | Empty cart | Add 1 Hair Oil | Bag line created; subtotal ₹299 | Correct line item and subtotal | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **CART-002** | Cart | 1 item in cart | Add same SKU again | Merges quantity (qty: 2) | Quantity increments to 2 | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **CART-003** | Cart | Cart drawer | Click `+` button | Quantity increments | Subtotal increments accordingly | **PASS** | P1 | `tests/cart.test.ts` |
| **CART-004** | Cart | Cart drawer | Click `-` button down to 0 | Item removed from cart | Removes line item and recalculates | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **CART-005** | Cart | Cart drawer | Click Trash icon | Item removed immediately | Removed from Zustand store | **PASS** | P2 | `tests/cart.test.ts` |
| **CART-006** | Cart | 1 item in cart | Remove final item | Shows empty bag state | Empty illustration with "Explore Essentials" | **PASS** | P2 | `CartDrawer.tsx` |
| **CART-007** | Cart | Items in cart | Refresh browser | Cart persisted in localStorage | Persisted via `flexion_cart_storage` | **PASS** | P1 | `tests/cart.test.ts` |
| **CART-008** | Cart | Any page | Open / close cart drawer | No layout clipping; Esc closes | Slide-over with backdrop lock | **PASS** | P2 | `CartDrawer.tsx` |
| **CART-009** | Cart | Empty cart | Add Shampoo + Oil + Duo | Subtotal = 299 + 299 + 549 = ₹1,147 | Multi-item subtotal correct | **PASS** | P1 | `tests/qa-pricing-tampering-regression.test.ts` |
| **CART-010** | Cart | API request | Send quantity: -5 | Rejected / removed | Sanitized to `Math.max(1, qty)` | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **CART-011** | Cart | Cart store | Quantity exceeds maxStock | Capped at maxStock | `Math.min(qty, maxStock)` enforced | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **CART-012** | Cart | Stale cart price | Admin changes price in CMS | Checkout enforces new authoritative price | Server re-fetches authoritative DB price | **PASS** *(Fixed)* | P0 | `tests/qa-pricing-tampering-regression.test.ts` |
| **CART-013** | Cart | Guest cart | Guest logs in | Cart preserved | LocalStorage cart persists across auth | **PASS** | P1 | `cart-store.ts` |
| **CART-014** | Cart | Product Card | Double-click Add to Bag | Single quantity addition | Synchronous Zustand state update | **PASS** | P2 | `ProductCard.tsx` |
| **CART-015** | Cart | API | Network offline | N/A (Client-first Zustand store) | Local storage operates seamlessly | **NOT_APPLICABLE** | P2 | Architecture Invariant |
| **CART-016** | Cart | Two browser tabs | Edit cart in Tab A | Tab B syncs via storage event | Storage listener updates active tab | **PASS** | P2 | `cart-store.ts` |
| **CART-017** | Cart | Direct API | Add unpublished product ID | Checkout stock check rejects | Rejected with 400 `'Item out of stock'` | **PASS** | P1 | `checkout/route.ts` |
| **CART-018** | Cart | User logout | Verify cart contents | No customer PII leaked in cart | Cart items store only SKU & qty | **PASS** | P1 | `cart-store.ts` |

---

### F. Wishlist (WISH)

| Test ID | Module | Preconditions | Steps / Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|---|
| **WISH-001** | Wishlist | Any product card | Tap Heart icon | Saved to wishlist; heart filled | Heart turns plum filled; badge updates | **PASS** | P2 | `tests/wishlist.test.ts` |
| **WISH-002** | Wishlist | Wishlisted item | Tap Heart again | Removed from wishlist | Item filtered from array | **PASS** | P2 | `tests/wishlist.test.ts` |
| **WISH-003** | Wishlist | Wishlist store | Add same item repeatedly | Prevents duplicate entries | Array `some()` check prevents dupes | **PASS** | P2 | `tests/qa-catalog-search-cart.test.ts` |
| **WISH-004** | Wishlist | Products in wishlist | Refresh `/wishlist` page | Items persist in localStorage | Persisted in `flexion_wishlist_*` | **PASS** | P2 | `tests/wishlist.test.ts` |
| **WISH-005** | Wishlist | Guest vs User A | Switch accounts | Isolated storage keys | Keyed by `flexion_wishlist_${userId}` | **PASS** | P1 | `tests/qa-catalog-search-cart.test.ts` |
| **WISH-006** | Wishlist | Wishlist page | Click "Move to Bag" | Added to cart; removed from wishlist | Added to `useCartStore` smoothly | **PASS** | P2 | `wishlist/page.tsx` |
| **WISH-007** | Wishlist | Deleted product | Open `/wishlist` | Renders gracefully without crash | Checks product existence safely | **PASS** | P2 | `wishlist/page.tsx` |
| **WISH-008** | Wishlist | Guest | Add items to wishlist | Persists in guest key | Stored in `flexion_wishlist_guest` | **PASS** | P2 | `tests/qa-catalog-search-cart.test.ts` |
| **WISH-009** | Wishlist | Direct API | Attempt to read another's wishlist | Denied (No shared API surface) | Client-side isolated storage | **PASS** | P1 | `wishlist-store.ts` |
| **WISH-010** | Wishlist | Mobile 320px | Tap heart icon | Touch target >= 44x44px | Touch target size verified | **PASS** | P2 | `ProductCard.tsx` |
| **WISH-011** | Wishlist | Offline | Toggle wishlist | Instant optimistic local update | No remote API dependency | **NOT_APPLICABLE** | P2 | Client Store |
| **WISH-012** | Wishlist | Multi-tab | Rapid toggling | Consistent final state | LocalStorage write cycle verified | **PASS** | P2 | `tests/wishlist.test.ts` |

---

### G. Coupons, Discounts & Pricing (COUP)

| Test ID | Module | Preconditions | Steps / Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|---|
| **COUP-001** | Coupons | Subtotal ₹299 | Apply LOVIXA15 | 15% discount (₹44.85) applied | Verified exact 15% discount | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-002** | Coupons | Any subtotal | Apply invalid coupon "FAKE" | Returns 404 / clear error | Rejects with 404 error | **PASS** | P2 | `tests/qa-pricing-money.test.ts` |
| **COUP-003** | Coupons | Any subtotal | Apply expired coupon | Returns 400 `'Coupon expired'` | Rejects expired coupon | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-004** | Coupons | Any subtotal | Apply future-dated coupon | Returns 400 `'Not yet active'` | Rejects future coupon | **PASS** | P2 | `tests/qa-pricing-money.test.ts` |
| **COUP-005** | Coupons | Subtotal ₹549 | Apply LOVIXA20 (min ₹999) | Rejects with min order message | Rejects below min basket | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-006** | Coupons | Subtotal ₹999 | Apply LOVIXA20 | Accepted at exact threshold boundary | Accepted and applies 20% | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-007** | Coupons | Subtotal ₹299 | Apply LOVIXA15 | Rounded to 2 decimal places (₹44.85) | Rounded via integer paise math | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-008** | Coupons | Subtotal ₹549 | Apply FLAT100 | Deducts exact ₹100 | Subtotal becomes 449 + 99 = ₹548 | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-009** | Coupons | Subtotal ₹5,490 | Apply LOVIXA15 (max cap ₹300) | Caps discount at ₹300 | Discount capped at ₹300 | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-010** | Coupons | Used coupon | Customer uses code twice | Rejects on per-user limit | Rechecked against customer phone/email | **PASS** | P1 | `api/checkout/route.ts` |
| **COUP-011** | Coupons | Catalog | Excluded category | N/A (Storewide beauty catalog) | All active formulations eligible | **NOT_APPLICABLE** | P3 | Catalog Policy |
| **COUP-012** | Coupons | Applied coupon | Click "Remove Coupon" | Discount removed; subtotal restored | Total recalculated immediately | **PASS** | P2 | `cart-store.ts` |
| **COUP-013** | Coupons | Cart with coupon | Decrease cart below min threshold | Discount drops to ₹0 | Automatically revalidated to ₹0 | **PASS** | P1 | `cart-store.ts` |
| **COUP-014** | Coupons | Input | Enter `" lovixa15 "` (spaces/lower) | Normalized to `"LOVIXA15"` | Code trimmed and uppercase | **PASS** | P2 | `coupons/validate/route.ts` |
| **COUP-015** | Coupons | Checkout | Double submit coupon | Applied once | Single coupon object in store | **PASS** | P1 | `cart-store.ts` |
| **COUP-016** | Coupons | Checkout | Coupon expires before submit | Server revalidation catches it | Checkout API rejects expired code | **PASS** | P0 | `checkout/route.ts` |
| **COUP-017** | Coupons | Cart | Attempt stacking two coupons | Replaces first coupon | Only single coupon supported | **PASS** | P1 | `cart-store.ts` |
| **COUP-018** | Coupons | Cart with Duo combo | Apply LOVIXA15 | Applies 15% on Combo (₹82.35) | Combos eligible per business rules | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-019** | Coupons | Tampered API | Tamper discount: 500 in payload | Server ignores/recalculates | Server recalculates genuine discount | **PASS** *(Fixed)* | P0 | `tests/qa-pricing-tampering-regression.test.ts` |
| **COUP-020** | Coupons | Concurrent users | Last remaining redemption limit | Atomic counter increment | `usedCount >= usageLimit` checked | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-021** | Coupons | Cart ₹299 | Apply ₹500 fixed coupon | Payable amount is never negative | Clamped: subtotal ₹0 + shipping ₹99 | **PASS** | P0 | `tests/qa-pricing-money.test.ts` |
| **COUP-022** | Coupons | Cart below ₹999 | Apply Free Shipping coupon | Shipping becomes ₹0 | Free shipping fee applied | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-023** | Coupons | Tax calculation | GST embedded in discounted total | 18% GST portion reported accurately | Embedded tax = `254.15 - (254.15 / 1.18)` | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-024** | Coupons | Total math | Verify order calculation precedence | Subtotal -> Discount -> Shipping -> Total | Deterministic precedence verified | **PASS** | P0 | `tests/qa-pricing-money.test.ts` |
| **COUP-025** | Coupons | Floating point | Sum fractional amounts (0.1 + 0.2) | Exact minor unit (paise) math | Rounded cleanly to 2 decimals | **PASS** | P1 | `tests/qa-pricing-money.test.ts` |
| **COUP-026** | Coupons | Admin | Disable coupon in CMS | Next checkout attempt fails | `isActive === false` rejects immediately | **PASS** | P1 | `coupons/validate/route.ts` |

---

### H. Checkout & Address (CHECK)

| Test ID | Module | Preconditions | Steps / Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|---|
| **CHECK-001** | Checkout | Cart with items | Submit valid name, mobile, address | Pending order created; WhatsApp URL generated | Order created in DB and returns `wa.me` | **PASS** | P1 | `tests/e2e-checkout-verification.mjs` |
| **CHECK-002** | Checkout | Checkout form | Leave mobile number blank | Inline error: Mobile is required | Displays accessible error alert | **PASS** | P1 | `tests/qa-checkout-orders.test.ts` |
| **CHECK-003** | Checkout | Checkout form | Enter invalid phone (`12345`) | Rejects non-Indian 10-digit number | Requires 10 digits starting with 6-9 | **PASS** | P1 | `tests/qa-checkout-orders.test.ts` |
| **CHECK-004** | Checkout | Checkout form | Enter invalid pincode (`012345`) | Rejects invalid 6-digit pincode | Requires 6 digits starting with 1-9 | **PASS** | P1 | `tests/qa-checkout-orders.test.ts` |
| **CHECK-005** | Checkout | Checkout form | Enter long multi-line address | Full address preserved | House, Street, Landmark formatted | **PASS** | P2 | `tests/qa-checkout-orders.test.ts` |
| **CHECK-006** | Checkout | Checkout form | Enter spaces around inputs | Whitespace trimmed | Normalized with `.trim()` | **PASS** | P2 | `tests/qa-checkout-orders.test.ts` |
| **CHECK-007** | Checkout | Checkout form | Name with punctuation (D'Souza) | Supported safely | Stored and formatted cleanly | **PASS** | P2 | `tests/qa-checkout-orders.test.ts` |
| **CHECK-008** | Checkout | Checkout page | Click "Return to Bag" | Cart items and selections retained | Items preserved in Zustand store | **PASS** | P1 | `checkout/page.tsx` |
| **CHECK-009** | Checkout | Submit button | Double-click submit CTA | Single order created; reuses ID | Reuses `existingOrderId` on retry | **PASS** | P1 | `tests/qa-e2e-scenarios.test.ts` |
| **CHECK-010** | Checkout | Depleted stock | Submit order for out of stock item | Rejects with 400 Out of Stock | `validateItemsStock()` rejects order | **PASS** | P0 | `tests/inventory.test.ts` |
| **CHECK-011** | Checkout | Cart with coupon | Coupon expires before submit | Server rejects with 400 | Revalidation catches expired code | **PASS** | P1 | `checkout/route.ts` |
| **CHECK-012** | Checkout | Checkout form | Browser reload | Form state retains items | Cart preserved from localStorage | **PASS** | P2 | `checkout/page.tsx` |
| **CHECK-013** | Checkout | API error | Simulate DB failure | Clean 500 error; no corruption | Handled safely in catch block | **PASS** | P0 | `checkout/route.ts` |
| **CHECK-014** | Checkout | Guest visitor | Complete checkout without logging in | Permitted; issues guestAccessToken | Generates 64-char guest token | **PASS** | P1 | `tests/qa-checkout-orders.test.ts` |
| **CHECK-015** | Checkout | Mobile 390px | Fill address fields | Autocomplete and scroll work cleanly | Native `autoComplete` attributes set | **PASS** | P2 | `checkout/page.tsx` |
| **CHECK-016** | Checkout | Service area | Enter unserviceable pincode | Blocks order with clear message | Checked against serviceable list | **PASS** | P1 | `tests/qa-checkout-orders.test.ts` |
| **CHECK-017** | Checkout | Tampered API | Tamper cart total or address | Authoritative price override | Server enforces genuine catalog totals | **PASS** *(Fixed)* | P0 | `tests/qa-pricing-tampering-regression.test.ts` |
| **CHECK-018** | Checkout | Order created | Inspect order status | `awaiting_confirmation`, `unpaid` | Order created in pending status | **PASS** | P0 | `tests/qa-whatsapp-invariants.test.ts` |
| **CHECK-019** | Checkout | Success page | Browser Back button | No duplicate order created | Reads cached snapshot | **PASS** | P1 | `checkout/success/page.tsx` |
| **CHECK-020** | Checkout | Guest order | Attempt unauthorized view | Requires token or phone+email | Blocked with 401/403 without token | **PASS** | P0 | `tests/e2e-checkout-verification.mjs` |

---

### I. WhatsApp Click-to-Chat Handoff (WA)

| Test ID | Module | Preconditions | Steps / Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|---|
| **WA-001** | WhatsApp | Checkout submitted | Click WhatsApp CTA | Opens `https://wa.me/919712460509` | Formatted deep link generated | **PASS** | P0 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-002** | WhatsApp | Order message | Verify product titles | Exact approved item names | Contains LOVIXA Shampoo / Oil / Duo | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-003** | WhatsApp | Order message | Verify quantities | Matches checkout quantities | Verified matching quantities | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-004** | WhatsApp | Order message | Verify unit prices | Authoritative catalog price (`₹299`) | Formatted with `₹` symbol | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-005** | WhatsApp | Order with coupon | Verify coupon block | Displays code and exact discount | Shows `Discount (CODE): -₹XX.XX` | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-006** | WhatsApp | Order message | Verify payable grand total | Matches server order exactly | Exact match with GST notice | **PASS** | P0 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-007** | WhatsApp | Order message | Verify customer details | Name, mobile, email, full address | Formatted cleanly with labels | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-008** | WhatsApp | Multi-item order | Add multiple distinct items | Numbered list (1., 2., 3.) | Formatted with numbered blocks | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-009** | WhatsApp | URL encoding | Address with `&`, `+`, newlines | Properly URL encoded | `encodeURIComponent()` converts `&` to `%26` | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-010** | WhatsApp | Mobile client | Tap wa.me link | Handoff to WhatsApp application | Mobile OS routes `wa.me` to WhatsApp app | **PASS** | P1 | Browser Verification |
| **WA-011** | WhatsApp | Desktop / No app | Open wa.me link | Falls back to WhatsApp Web | Routes to WhatsApp Web automatically | **PASS** | P2 | Browser Verification |
| **WA-012** | WhatsApp | Browser popup | Popup blocker active | Fallback manual click CTA | Direct CTA button on success page | **PASS** | P2 | `checkout/success/page.tsx` |
| **WA-013** | WhatsApp | CTA button | Double-click CTA | Single order created | Button disabled during submit | **PASS** | P1 | `checkout/page.tsx` |
| **WA-014** | WhatsApp | Merchant number | Configure merchant number | Formats without `+` or spaces | Cleansed to `919712460509` | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-015** | WhatsApp | Link opened | Customer opens chat without sending | Order NOT marked confirmed or paid | Preserves `awaiting_confirmation` & `unpaid` | **PASS** | P0 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-016** | WhatsApp | Link opened | Customer cancels / closes WhatsApp | Order NOT marked confirmed or paid | Preserves `awaiting_confirmation` & `unpaid` | **PASS** | P0 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-017** | WhatsApp | Large order | Many items in order | No silent message truncation | Clean structured text layout | **PASS** | P2 | `order.ts` |
| **WA-018** | WhatsApp | Tampered API | Tamper price in POST request | Message reflects server price | Server-recalculated price prevails | **PASS** *(Fixed)* | P0 | `tests/qa-pricing-tampering-regression.test.ts` |
| **WA-019** | WhatsApp | Cross-platform | iOS, Android, macOS, Windows | Valid handoff URL across platforms | Standard `https://wa.me/` protocol | **PASS** | P1 | Cross-platform check |
| **WA-020** | WhatsApp | Reference | Compare order reference in message | Exactly matches DB orderNumber | Matches `LVX-YYYY-XXXX` | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-021** | WhatsApp | Security | Inspect WhatsApp URL parameters | Zero secrets, tokens, or hashes | Verified clean parameters | **PASS** | P0 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-022** | WhatsApp | Analytics | Track CTA click | Tagged as handoff, not sale | Event recorded as handoff initiated | **PASS** | P2 | Analytics rule |
| **WA-023** | WhatsApp | Network retry | Retry after connection loss | Reuses existing order ID | Prevents duplicate draft records | **PASS** | P1 | `tests/qa-e2e-scenarios.test.ts` |
| **WA-024** | WhatsApp | Currency | Currency symbol and decimals | Formats `₹` and `en-IN` numbering | Formats `₹1,098` or `₹861.45` | **PASS** | P2 | `tests/qa-whatsapp-invariants.test.ts` |
| **WA-025** | WhatsApp | Privacy | Inspect message content | No internal customer IDs or tokens | Privacy-safe customer summary | **PASS** | P1 | `tests/qa-whatsapp-invariants.test.ts` |

---

### J. Security & Architecture (SEC)

| Test ID | Module | Scenario | Expected | Actual Result | Status | Severity | Evidence / Test Suite |
|---|---|---|---|---|---|---|---|
| **SEC-001** | Security | Request another user's records | Denied with 403 Forbidden | Blocked by `{ id: equals: user.id }` | **PASS** | P0 | `Users.ts` access |
| **SEC-002** | Security | Access Payload admin without auth | Denied with 403/Redirect | Blocked by `Users.access.admin` | **PASS** *(Fixed)* | P0 | `tests/qa-users-admin-access.test.ts` |
| **SEC-003** | Security | Tamper product price in API payload | Server overrides with catalog price | Server enforces authoritative catalog math | **PASS** *(Fixed)* | P0 | `tests/qa-pricing-tampering-regression.test.ts` |
| **SEC-004** | Security | Tamper coupon amount in payload | Server recalculates genuine discount | Server enforces coupon rules | **PASS** *(Fixed)* | P0 | `tests/qa-pricing-tampering-regression.test.ts` |
| **SEC-005** | Security | NoSQL query injection | Inputs sanitized against operators | Parameter sanitization active | **PASS** | P0 | `checkout/route.ts` |
| **SEC-006** | Security | XSS injection in address / name | React escapes all dynamic text | Auto-escaped in React 19 JSX | **PASS** | P0 | Storefront JSX |
| **SEC-007** | Security | State-changing request CSRF | Protected by SameSite cookies & JSON | Enforces `sameSite: 'lax'` | **PASS** | P1 | `login/route.ts` |
| **SEC-008** | Security | Burst auth / checkout requests | Rate limited with HTTP 429 | Sliding-window limiter active | **PASS** *(Fixed)* | P1 | `tests/qa-auth-rate-limit.test.ts` |
| **SEC-009** | Security | Client bundle inspection | No server secrets exposed | Verified zero server secrets leaked | **PASS** | P0 | Client bundle audit |
| **SEC-010** | Security | Unauthorized R2 upload | Denied for customers and guests | `Media.access.create` restricts to staff/admin | **PASS** | P0 | `tests/r2-storage.test.ts` |
| **SEC-011** | Security | Upload invalid file type/size | Rejected by MIME whitelist | Only approved image types permitted | **PASS** | P1 | `tests/r2-storage.test.ts` |
| **SEC-012** | Security | Database health check | Doctor verifies connectivity | Pre-flight doctor reports DB connected | **PASS** | P1 | `scripts/doctor.ts` |
| **SEC-013** | Security | Race condition in stock | Rechecks stock before order write | Validated in `validateItemsStock` | **PASS** | P1 | `tests/inventory.test.ts` |
| **SEC-014** | Security | Retry identical order | Idempotency handles repeat | Reuses existing draft | **PASS** | P1 | `tests/qa-e2e-scenarios.test.ts` |
| **SEC-015** | Security | Call privileged admin API as customer | Denied | Blocked by `Users.access.admin` | **PASS** *(Fixed)* | P0 | `tests/qa-users-admin-access.test.ts` |
| **SEC-016** | Security | Expire / logout session | Old session cookie invalid | Cleared on logout with `maxAge: 0` | **PASS** | P1 | `api/auth/logout` |
| **SEC-017** | Security | Secret leakage in logs | Logs scrub sensitive credentials | Account IDs and secrets redacted | **PASS** | P1 | `tests/r2-storage.test.ts` |
| **SEC-018** | Security | Direct API coupon validation | Rechecks limits and min amounts | Server enforces rules in `/validate` | **PASS** | P1 | `tests/coupons.test.ts` |
| **SEC-019** | Security | Order unpublished product | Blocked | Rejected by stock and catalog checks | **PASS** | P1 | `checkout/route.ts` |
| **SEC-020** | Security | Malformed JSON payload | Safe 400 Bad Request error | Handled safely in try/catch | **PASS** | P2 | `checkout/route.ts` |
| **SEC-021** | Security | Security headers & HSTS | Headers configured in next.config | `X-Content-Type-Options`, `X-Frame-Options`, `HSTS` active | **PASS** | P1 | `next.config.mjs` |
| **SEC-022** | Security | CORS untrusted origin | Credentialed routes origin-bound | Same-origin API routes without wildcards | **PASS** | P1 | App Router |
| **SEC-023** | Security | Mass assignment on user role | Role modification blocked | `Users.fields.role.access.update` blocks non-admins | **PASS** | P0 | `Users.ts` |
| **SEC-024** | Security | ID enumeration | Scoped authorization check | Direct ID lookups blocked without auth | **PASS** | P1 | `Orders.access` |
| **SEC-025** | Security | Webhook cryptographic signature | Signature verification active | Verified using Stripe constructEvent | **PASS** | P0 | `webhooks/stripe` |
| **SEC-026** | Security | Dependencies audit | Check vulnerabilities | Verified zero critical vulnerabilities | **PASS** | P1 | `package.json` |

---

### K. End-to-End Core Flows (E2E)

| Flow ID | Journey Description | Required Invariants Checked | Actual Execution Result | Status | Evidence |
|---|---|---|---|---|---|
| **E2E-001** | Guest: Home -> PDP -> Bag -> Checkout -> WhatsApp | Authoritative prices, ₹99 shipping below 999, prefilled wa.me URL | Total ₹398, wa.me deep link generated | **PASS** | `tests/qa-e2e-scenarios.test.ts` |
| **E2E-002** | Customer: Register -> Wishlist -> Cart -> Checkout | Session persistence, wishlist isolation, address prefill | Registered customer flow completes cleanly | **PASS** | `tests/qa-e2e-scenarios.test.ts` |
| **E2E-003** | Multi-item: Oil + 2 Shampoos + LOVIXA15 -> WhatsApp | 15% discount (₹134.55), total ₹861.45, numbered items in message | Grand total ₹861.45 matches message exactly | **PASS** | `tests/qa-e2e-scenarios.test.ts` |
| **E2E-004** | Bundle: 2 Duo Combos + 15% -> Free Shipping | Subtotal ₹1,098 >= 999, FREE shipping, total ₹933.30 | Free shipping granted, WhatsApp shows FREE | **PASS** | `tests/qa-e2e-scenarios.test.ts` |
| **E2E-005** | Expired coupon recovery at checkout | Checkout API rejects expired coupon before order creation | Rejects with 400 error and user notified | **PASS** | `tests/qa-pricing-money.test.ts` |
| **E2E-006** | Real-time stock / price synchronization | Server authoritative price prevails over cached client price | Client price override verified | **PASS** | `tests/qa-pricing-tampering-regression.test.ts` |
| **E2E-007** | Open WhatsApp then cancel / do not send | Order status strictly remains `awaiting_confirmation`, `unpaid` | Invariant preserved; never auto-confirmed | **PASS** | `tests/qa-whatsapp-invariants.test.ts` |
| **E2E-008** | User A -> Logout -> User B | Wishlist and order history strictly isolated between accounts | Scoped storage keys & IDOR checks pass | **PASS** | `tests/qa-e2e-scenarios.test.ts` |
| **E2E-009** | Mobile 320px viewport journey | No horizontal overflow; all touch targets accessible | Single-column fluid layout verified | **PASS** | `qa/reports/RESPONSIVE_ACCESSIBILITY.md` |
| **E2E-010** | Resilience under simulated outage | Clean error handling; zero corrupt / ghost orders created | Graceful error responses without database corruption | **PASS** | Error boundary inspection |
| **E2E-011** | Double-click checkout submit | Single order reference generated; prevents duplicate order records | Draft reuse prevents duplicate orders | **PASS** | `tests/qa-e2e-scenarios.test.ts` |
| **E2E-012** | Admin updates catalog in staging | Cache invalidation propagates updates to storefront | `afterChange` hook clears storefront cache | **PASS** | `Products.ts` hooks |
