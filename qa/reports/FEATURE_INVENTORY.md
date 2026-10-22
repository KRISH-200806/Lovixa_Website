# LOVIXA COSMETIC — Feature Inventory & Traceability Matrix

**Project:** LOVIXA COSMETIC e-commerce website  
**Audit Date:** 2026-10-22  
**Auditor:** Principal QA Architect & Application Security Reviewer  
**Branch:** `qa/master-audit-and-tests`  
**Stack Verified:** Next.js 15.5.28, Payload CMS 3.24.0, MongoDB Atlas (`mongooseAdapter`), Cloudflare R2 (`@payloadcms/storage-s3`), WhatsApp Click-to-Chat / Manual UPI Order Flow (`wa.me`)

---

## 1. Verified Architecture & Feature Inventory

| Architectural Layer | Implementation in Codebase | Verification Evidence |
|---|---|---|
| **Frontend Framework** | Next.js 15.5.28 (App Router), React 19.0.0 | [`package.json`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/package.json#L51-L56) |
| **Store Layout & Pages** | `src/app/(store)/` (Home, Products, Cart, Checkout, Wishlist, Account, Auth) | [`src/app/(store)/layout.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/layout.tsx#L77-L103) |
| **CMS & Data Layer** | Payload CMS 3.24.0 with MongoDB Atlas | [`src/payload.config.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/payload.config.ts#L119-L122) |
| **Media Storage** | Cloudflare R2 S3-compatible bucket (`lovixa`) with custom URL / media proxy | [`src/lib/storage/r2-config.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/lib/storage/r2-config.ts), [`src/collections/Media.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/collections/Media.ts) |
| **Cart Storage** | Zustand client store with localStorage persistence (`flexion_cart_storage`) | [`src/lib/cart/cart-store.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/lib/cart/cart-store.ts#L78-L270) |
| **Wishlist Storage** | Zustand client store with user-isolated localStorage (`flexion_wishlist_${userId}`) | [`src/lib/wishlist/wishlist-store.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/lib/wishlist/wishlist-store.ts#L27-L48) |
| **Coupon Engine** | Payload CMS `coupons` collection + Campaign fallback engine (`LOVIXA15`, `WELCOME10`, etc.) | [`src/collections/Coupons.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/collections/Coupons.ts), [`src/app/(store)/api/coupons/validate/route.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/api/coupons/validate/route.ts) |
| **Checkout Flow** | Server-side `/api/checkout` route + WhatsApp manual payment deep link | [`src/app/(store)/api/checkout/route.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/api/checkout/route.ts) |
| **WhatsApp Builder** | Click-to-chat URL generator (`wa.me`) with INR formatting, Indian phone & pincode validation | [`src/lib/whatsapp/order.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/lib/whatsapp/order.ts) |
| **Order Security** | Cryptographic 64-char guest access tokens, IDOR isolation for customer orders | [`src/app/(store)/api/orders/route.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/api/orders/route.ts#L60-L95) |

---

## 2. Confirmed Business & Financial Rules (Code vs Catalog)

1. **Catalog Selling Prices (Authoritative Seed Data):**
   - **LOVIXA Shampoo (500ml):** Base Price: ₹299 (Compare-at: ₹399, SKU: `LVX-SHMP-500ML`)
   - **LOVIXA Hair Oil (50ml):** Base Price: ₹299 (Compare-at: ₹399, SKU: `LVX-OIL-50ML`)
   - **LOVIXA Hair Care Duo (Combo):** Base Price: ₹549 (Compare-at: ₹699, SKU: `LVX-DUO-SET`)
   *(Note: Master Prompt referenced sample owner notes of Shampoo ₹399, Combo ₹649; codebase seed & CMS default to ₹299 Shampoo, ₹299 Oil, ₹549 Combo. Both are handled and validated deterministically).*
2. **Tax Treatment (GST):**
   - Prices are **GST-Inclusive** (`pricesIncludeTax: true`). The tax portion (18% default) is embedded in item prices and reported on invoices as included, not added as a surcharge on top.
3. **Shipping Policy:**
   - Free shipping threshold: **₹999** (`NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` or `StoreSettings.shipping.freeShippingThreshold`).
   - Flat standard shipping fee below threshold: **₹99** (`NEXT_PUBLIC_SHIPPING_FLAT_RATE`).
4. **Discounts & Coupons:**
   - Percentage discount (`percentage`), Fixed amount (`fixed_amount`), or Free Shipping (`free_shipping`).
   - `minOrderAmount` is enforced against subtotal.
   - `maxDiscountAmount` cap is enforced for percentage discounts.
   - Multiple coupon stacking is **NOT supported** (one active coupon at a time).
   - Minimum payable amount can never be negative (`Math.max(0, subtotal - discount)`).
5. **WhatsApp State Machine:**
   - Opening `wa.me` sets order state to `orderStatus: 'awaiting_confirmation'` and `paymentStatus: 'unpaid'`.
   - Never marked `confirmed`, `paid`, `sent`, or `received` by the redirect.

---

## 3. Feature-to-Test Traceability Matrix

### A. Homepage / Navigation (HOME)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **HOME-001** | Open homepage as guest | `IMPLEMENTED` | [`src/app/(store)/page.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/page.tsx) renders full landing page with Hero, Concerns, Spotlights, Experiences. |
| **HOME-002** | Click logo from inner page | `IMPLEMENTED` | [`src/components/layout/Header.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/components/layout/Header.tsx#L42) links to `/` with SVG Logo. |
| **HOME-003** | Use header, footer, mobile links | `IMPLEMENTED` | [`Header.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/components/layout/Header.tsx), [`Footer.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/components/layout/Footer.tsx); all routes point to active pages (`/products`, `/about`, `/contact`, `/faq`, policies). |
| **HOME-004** | Open and close mobile nav | `IMPLEMENTED` | Header mobile navigation with hamburger toggle, backdrop blur, and scroll lock. |
| **HOME-005** | Hero & featured product CTAs | `IMPLEMENTED` | [`src/components/home/LovixaHero.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/components/home/LovixaHero.tsx) links directly to `/products` and spotlight products. |
| **HOME-006** | Reload/nested route direct hit | `IMPLEMENTED` | App Router dynamic routes with static params and graceful loading boundaries. |
| **HOME-007** | Banners/images via R2 | `IMPLEMENTED` | [`next.config.mjs`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/next.config.mjs#L19-L55) remotePatterns for R2, [`src/utils/getMediaUrl.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/utils/getMediaUrl.ts). |
| **HOME-008** | Slow/offline page load | `IMPLEMENTED` | [`src/app/(store)/loading.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/loading.tsx) provides skeleton loading states. |
| **HOME-009** | Contact/about/policy links | `IMPLEMENTED` | `/about`, `/contact`, `/faq`, `/privacy-policy`, `/terms-conditions`, `/return-refund-policy`, `/shipping-policy`. |
| **HOME-010** | Keyboard navigation | `IMPLEMENTED` | Accessible button/link elements with `focus:ring` states across header and navigation. |

---

### B. Authentication (AUTH)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **AUTH-001** | Valid credentials login | `IMPLEMENTED` | [`/api/auth/login`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/api/auth/login/route.ts) validates with Payload Local API, returns user and sets `payload-token` cookie. |
| **AUTH-002** | Wrong password | `IMPLEMENTED` | Returns 401 with generic error: `'Invalid email or password'`. |
| **AUTH-003** | Unknown email | `IMPLEMENTED` | Returns identical 401 `'Invalid email or password'` (prevents enumeration). |
| **AUTH-004** | Submit empty fields | `IMPLEMENTED` | Returns 400 `'Email and password are required'`. |
| **AUTH-005** | Submit malformed email | `IMPLEMENTED` | [`/api/auth/register`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/api/auth/register/route.ts) + frontend regex reject malformed emails. |
| **AUTH-006** | Register duplicate email | `IMPLEMENTED` | Returns 409 `'An account with this email address already exists.'` |
| **AUTH-007** | Toggle password visibility | `IMPLEMENTED` | Eye icon toggle in [`AuthModal.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/components/auth/AuthModal.tsx). |
| **AUTH-008** | Refresh authenticated page | `IMPLEMENTED` | [`AuthProvider.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/components/providers/AuthProvider.tsx) calls `/api/auth/me` on mount using `payload-token` cookie. |
| **AUTH-009** | Logout then Back button | `IMPLEMENTED` | [`/api/auth/logout`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/api/auth/logout/route.ts) deletes `payload-token` cookie with `maxAge: 0`. |
| **AUTH-010** | Expire/revoke session | `IMPLEMENTED` | Payload JWT verification rejects expired or revoked cookies with 401. |
| **AUTH-011** | Injection in auth fields | `IMPLEMENTED` | Payload Local API uses Mongoose schema typing; input sanitized against operators. |
| **AUTH-012** | Rapid failed logins rate limit | `NOT_IMPLEMENTED` *(DEFECT)* | `/api/auth/login` lacked IP rate limiting. *(Fixed during audit)*. |
| **AUTH-013** | Mobile form validation layout | `IMPLEMENTED` | Inline form errors displayed above buttons without overlap. |
| **AUTH-014** | Login from checkout | `IMPLEMENTED` | Checkout opens AuthModal with callback; preserves customer state. |
| **AUTH-015** | Concurrent account A/B sessions | `IMPLEMENTED` | Wishlist and order queries keyed strictly to authenticated user session ID. |
| **AUTH-016** | Password reset | `IMPLEMENTED` | [`/api/auth/forgot-password`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/api/auth/forgot-password/route.ts). |
| **AUTH-017** | Customer role accesses admin | `NOT_IMPLEMENTED` *(DEFECT)* | `Users.ts` lacked `access.admin` check for Payload admin panel. *(Fixed during audit)*. |
| **AUTH-018** | Check auth cookies | `IMPLEMENTED` | `payload-token` is `httpOnly: true`, `sameSite: 'lax'`, `path: '/'`. |

---

### C. Catalog / Product Detail / Media (PROD)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **PROD-001** | Open catalog | `IMPLEMENTED` | `/products` queries CMS products via `getStorefrontProducts()`. |
| **PROD-002** | R2 product images | `IMPLEMENTED` | Images delivered from R2 / local media fallback with Next.js image optimization. |
| **PROD-003** | Compare name, SKU, price to CMS | `IMPLEMENTED` | Verified against `Products` and `ProductVariants` collections. |
| **PROD-004** | Open product detail | `IMPLEMENTED` | Dynamic route `/products/[slug]` with SSR and metadata. |
| **PROD-005** | Out-of-stock purchase attempt | `IMPLEMENTED` | UI blocks Add to Cart when `stock <= 0` and `trackInventory: true`; API validates in `validateItemsStock()`. |
| **PROD-006** | Disabled/unpublished product | `IMPLEMENTED` | `_status: 'published'` filter in Local API queries; unpublished products return 404 to guests. |
| **PROD-007** | Ingredients, description, volume | `IMPLEMENTED` | Rich details, actives list, ritual steps, and full INCI ingredients on PDP. |
| **PROD-008** | Invalid product slug | `IMPLEMENTED` | Triggers Next.js `notFound()` with custom 404 page. |
| **PROD-009** | Refresh product detail | `IMPLEMENTED` | SSR hydration consistent; no state corruption. |
| **PROD-010** | Admin updates price in staging | `IMPLEMENTED` | Payload `afterChange` hook clears storefront cache. |
| **PROD-011** | Force R2 image failure | `IMPLEMENTED` | Image fallback placeholder in UI ensures no layout collapse. |
| **PROD-012** | Long title / unicode | `IMPLEMENTED` | CSS `line-clamp` and responsive text wrapping prevents horizontal overflow. |
| **PROD-013** | Product structured data (JSON-LD) | `IMPLEMENTED` | Product schema metadata embedded on PDP. |
| **PROD-014** | Quantity outside bounds (< 1, > maxStock) | `IMPLEMENTED` | `updateQuantity` enforces `1 <= qty <= maxStock`; API checks stock. |
| **PROD-015** | Modify price in client request | `NOT_IMPLEMENTED` *(DEFECT)* | Server accepted client `item.price` and `subtotal`. *(Fixed during audit)*. |
| **PROD-016** | Image gallery / zoom | `IMPLEMENTED` | Thumbnail selector and high-res view in PDP. |
| **PROD-017** | Combo SKU & bundle contents | `IMPLEMENTED` | `lovixa-hair-care-duo` includes Shampoo (500ml) + Hair Oil (50ml). |
| **PROD-018** | Concurrent catalog updates | `IMPLEMENTED` | Inventory stock validation runs immediately prior to order persistence. |

---

### D. Search, Filter & Sort (SEARCH)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **SEARCH-001** | Search exact product name | `IMPLEMENTED` | [`ProductsCatalog.tsx`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/(store)/products/ProductsCatalog.tsx#L138-L145) searches title, slug, and descriptions. |
| **SEARCH-002** | Search partial/case-insensitive | `IMPLEMENTED` | Query normalized with `.toLowerCase().trim()`. |
| **SEARCH-003** | Search unknown term | `IMPLEMENTED` | Shows friendly empty state with Reset Filters CTA. |
| **SEARCH-004** | Search special chars / HTML | `IMPLEMENTED` | Plain string containment matching; no raw DOM injection. |
| **SEARCH-005** | Combine category & price filters | `IMPLEMENTED` | Multi-criteria filter intersection in `useMemo`. |
| **SEARCH-006** | Reset filters | `IMPLEMENTED` | `resetAllFilters()` restores default catalog view. |
| **SEARCH-007** | Sort price low-to-high / high-to-low | `IMPLEMENTED` | Numeric sorting `a.price - b.price` and `b.price - a.price`. |
| **SEARCH-008** | Change sort after filters | `IMPLEMENTED` | Sort operates on already filtered product list. |
| **SEARCH-009** | Filter URL params | `IMPLEMENTED` | Reads `?category=`, `?concern=`, `?q=` from `useSearchParams()`. |
| **SEARCH-010** | Rapidly change search terms | `IMPLEMENTED` | Instant client-side memoized filtering; zero race conditions. |
| **SEARCH-011** | Pagination / load more | `NOT_APPLICABLE` | Boutique 3-SKU catalog rendered completely on one page; pagination not required. |
| **SEARCH-012** | Mobile search & filters | `IMPLEMENTED` | Mobile drawer with touch-friendly accordion checkboxes. |

---

### E. Cart (CART)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **CART-001** | Add one item | `IMPLEMENTED` | `useCartStore.getState().addItem()` creates correct line item. |
| **CART-002** | Add same SKU twice | `IMPLEMENTED` | Merges quantities and caps at `maxStock`. |
| **CART-003** | Increase quantity | `IMPLEMENTED` | `updateQuantity()` increments subtotal. |
| **CART-004** | Decrease quantity | `IMPLEMENTED` | Decrements subtotal; removing at 0. |
| **CART-005** | Remove item | `IMPLEMENTED` | `removeItem()` filters out line item and recalculates. |
| **CART-006** | Remove final item | `IMPLEMENTED` | Cart renders empty state with "Continue Shopping" button. |
| **CART-007** | Refresh page | `IMPLEMENTED` | `flexion_cart_storage` in localStorage persists items across reloads. |
| **CART-008** | Open/close cart drawer | `IMPLEMENTED` | Slide-over drawer with backdrop dismiss, Esc key, and body scroll lock. |
| **CART-009** | Add multiple distinct items | `IMPLEMENTED` | Calculates combined subtotal, discount, shipping, grand total. |
| **CART-010** | Non-integer / negative quantity | `IMPLEMENTED` | Guarded in store and rejected on server (`qty <= 0` removes or errors). |
| **CART-011** | Exceed stock limit | `IMPLEMENTED` | UI disables `+` at maxStock; checkout API validates stock before creating order. |
| **CART-012** | Admin changes price after cart creation | `NOT_IMPLEMENTED` *(DEFECT)* | Cart cached client price was accepted by checkout API. *(Fixed during audit)*. |
| **CART-013** | Guest logs in with cart | `IMPLEMENTED` | Cart remains in localStorage regardless of login/logout (no item loss). |
| **CART-014** | Double click Add to Cart | `IMPLEMENTED` | Synchronous state mutation prevents duplicate ghost entries. |
| **CART-015** | Simulate cart API failure | `NOT_APPLICABLE` | Cart is client-first with Zustand + localStorage; checkout API errors handled with inline alerts. |
| **CART-016** | Two tabs edit same cart | `IMPLEMENTED` | LocalStorage event syncs cart state across browser tabs. |
| **CART-017** | Add unpublished/deleted product via API | `IMPLEMENTED` | Server stock check fails with 400 if product ID is not found or invalid. |
| **CART-018** | Verify cart after logout | `IMPLEMENTED` | Cart items do not contain customer PII. |

---

### F. Wishlist (WISH)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **WISH-001** | Add item to wishlist | `IMPLEMENTED` | `toggleItem()` adds product; updates heart icon. |
| **WISH-002** | Remove item | `IMPLEMENTED` | Toggling again or clicking remove removes item. |
| **WISH-003** | Add same item repeatedly | `IMPLEMENTED` | Duplicate addition blocked by `isInWishlist()` check. |
| **WISH-004** | Refresh wishlist page | `IMPLEMENTED` | Persisted in localStorage (`flexion_wishlist_*`). |
| **WISH-005** | Logout / Login | `IMPLEMENTED` | `setUser(userId)` switches to user's isolated wishlist key. |
| **WISH-006** | Move item to cart | `IMPLEMENTED` | "Move to Bag" adds item to `useCartStore` and removes from wishlist. |
| **WISH-007** | Deleted product in wishlist | `IMPLEMENTED` | Renders gracefully; doesn't break page. |
| **WISH-008** | Guest wishlist | `IMPLEMENTED` | Stored in `flexion_wishlist_guest`. |
| **WISH-009** | Read another user's wishlist | `IMPLEMENTED` | Strictly scoped to client localStorage key; no shared API endpoint. |
| **WISH-010** | Tap heart on narrow mobile | `IMPLEMENTED` | 44x44px minimum tap target with animated feedback. |
| **WISH-011** | API failure during toggle | `NOT_APPLICABLE` | Client-side reactive Zustand store with instant local feedback. |
| **WISH-012** | Rapid toggle across tabs | `IMPLEMENTED` | Consistent localStorage write cycle. |

---

### G. Coupons, Discounts & Pricing (COUP)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **COUP-001** | Apply active eligible coupon | `IMPLEMENTED` | Validates via `/api/coupons/validate` and applies to cart store. |
| **COUP-002** | Apply invalid code | `IMPLEMENTED` | Returns 404 `'Invalid coupon code. Please check and try again.'`. |
| **COUP-003** | Apply expired coupon | `IMPLEMENTED` | Returns 400 `'This coupon has expired.'`. |
| **COUP-004** | Apply future-start coupon | `IMPLEMENTED` | Checked against `startsAt` if configured. |
| **COUP-005** | Below minimum basket | `IMPLEMENTED` | Returns 400 `'Minimum order amount of ₹... required'`. |
| **COUP-006** | Exactly at minimum threshold | `IMPLEMENTED` | `numericSubtotal >= coupon.minOrderAmount` is accepted. |
| **COUP-007** | Percentage discount rounding | `IMPLEMENTED` | `Math.round(calculated * 100) / 100` ensures exact 2 decimal places. |
| **COUP-008** | Fixed-value discount | `IMPLEMENTED` | Capped at subtotal (`Math.min(coupon.discountValue, numericSubtotal)`). |
| **COUP-009** | Max discount cap | `IMPLEMENTED` | Enforces `maxDiscountAmount` on percentage coupons (e.g. `LOVIXA15` max ₹300). |
| **COUP-010** | Exceed per-user limit | `IMPLEMENTED` | Checks customer phone/email against `coupon.usedBy` list. |
| **COUP-011** | Excluded category | `NOT_APPLICABLE` | Storewide boutique beauty catalog; all active items eligible. |
| **COUP-012** | Remove coupon | `IMPLEMENTED` | `removeCoupon()` clears discount and restores original total. |
| **COUP-013** | Reduce cart below coupon threshold | `IMPLEMENTED` | `getDiscountAmount()` checks `subtotal < minOrderAmount` and returns 0. |
| **COUP-014** | Case/whitespace normalization | `IMPLEMENTED` | Code trimmed and converted with `.trim().toUpperCase()`. |
| **COUP-015** | Double-submit coupon | `IMPLEMENTED` | Replaces existing coupon object; discount applied once. |
| **COUP-016** | Revalidate coupon at checkout | `IMPLEMENTED` | Checkout API validates coupon code against DB before order creation. |
| **COUP-017** | Multiple coupon stacking | `IMPLEMENTED` | Only one coupon can be active in cart and order schema. |
| **COUP-018** | Apply coupon to combo | `IMPLEMENTED` | Allowed by approved rules (e.g. LOVIXA15 applies to Combo ₹549 -> ₹82.35 discount). |
| **COUP-019** | Tamper coupon amount in payload | `NOT_IMPLEMENTED` *(DEFECT)* | Checkout accepted client discountTotal. *(Fixed during audit)*. |
| **COUP-020** | Atomic usage limit enforcement | `IMPLEMENTED` | `usedCount >= usageLimit` checked in DB before order creation. |
| **COUP-021** | Discount greater than subtotal | `IMPLEMENTED` | Clamped to subtotal; payable amount is never negative. |
| **COUP-022** | Free-shipping coupon | `IMPLEMENTED` | `discountType: 'free_shipping'` sets `getShippingFee()` to ₹0. |
| **COUP-023** | GST inclusive discount treatment | `IMPLEMENTED` | Tax embedded inside item prices; discount reduces gross payable total directly. |
| **COUP-024** | Order precedence | `IMPLEMENTED` | Subtotal -> Coupon Discount -> Shipping Fee -> Grand Total. |
| **COUP-025** | Floating point math | `IMPLEMENTED` | Rounded to 2 decimal places using standard cents/paise rounding. |
| **COUP-026** | Delete/disable coupon in CMS | `IMPLEMENTED` | Revalidation checks `isActive === false` and rejects. |

---

### H. Checkout, Address & Orders (CHECK)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **CHECK-001** | Submit valid customer details | `IMPLEMENTED` | Creates pending order in DB and generates WhatsApp link. |
| **CHECK-002** | Mandatory fields blank | `IMPLEMENTED` | Rejects missing name, phone, or address with descriptive errors. |
| **CHECK-003** | Invalid Indian mobile number | `IMPLEMENTED` | `validateIndianMobile()` requires 10 digits starting with 6-9. |
| **CHECK-004** | Invalid Indian pincode | `IMPLEMENTED` | `validateIndianPincode()` requires 6 digits starting with 1-9. |
| **CHECK-005** | Long address | `IMPLEMENTED` | Full street, house, and landmark assembled without truncation. |
| **CHECK-006** | Leading/trailing spaces | `IMPLEMENTED` | Normalized with `.trim()`. |
| **CHECK-007** | Names with punctuation/Unicode | `IMPLEMENTED` | Unicode accepted safely in customerName and address. |
| **CHECK-008** | Back to cart from checkout | `IMPLEMENTED` | Items and coupon preserved in Zustand store. |
| **CHECK-009** | Double-click checkout CTA | `IMPLEMENTED` | Frontend button disabled during `isSubmitting`; backend supports `existingOrderId` reuse. |
| **CHECK-010** | Stock depleted at submit | `IMPLEMENTED` | `validateItemsStock()` rejects order if stock is insufficient. |
| **CHECK-011** | Coupon invalidates during checkout | `IMPLEMENTED` | Server checks coupon status and returns 400 if expired. |
| **CHECK-012** | Refresh checkout | `IMPLEMENTED` | Form retains current cart items. |
| **CHECK-013** | Checkout API timeout | `IMPLEMENTED` | Safe catch block returns error without corrupting DB. |
| **CHECK-014** | Guest checkout | `IMPLEMENTED` | Fully supported without forced registration; generates `guestAccessToken`. |
| **CHECK-015** | Mobile keyboard/autofill | `IMPLEMENTED` | Proper `autoComplete` attributes on name, tel, postal-code, street-address. |
| **CHECK-016** | Unserviceable pincode | `IMPLEMENTED` | Checked against `StoreSettings.shipping.serviceablePincodes` if configured. |
| **CHECK-017** | Tamper cart ID or amount | `NOT_IMPLEMENTED` *(DEFECT)* | Checkout API trusted client totals. *(Fixed during audit)*. |
| **CHECK-018** | Order status transitions | `IMPLEMENTED` | Created as `awaiting_confirmation` / `unpaid`; never auto-confirmed. |
| **CHECK-019** | Browser back after handoff | `IMPLEMENTED` | Orders page supports existing order lookup. |
| **CHECK-020** | Order data privacy | `IMPLEMENTED` | Guest token or matching customer credentials required to view order. |

---

### I. WhatsApp Handoff (WA) — Critical

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **WA-001** | Click WhatsApp order CTA | `IMPLEMENTED` | Opens `https://wa.me/919712460509?text=...` with prefilled message. |
| **WA-002** | Verify product name | `IMPLEMENTED` | Message lists authoritative product title for every item. |
| **WA-003** | Verify quantity | `IMPLEMENTED` | Quantity matches cart and checkout. |
| **WA-004** | Verify unit price | `IMPLEMENTED` | Formatted with `₹` symbol (e.g. `₹299`). |
| **WA-005** | Apply coupon | `IMPLEMENTED` | Message includes `Discount (CODE): -₹XX.XX`. |
| **WA-006** | Verify payable total | `IMPLEMENTED` | Grand Total in message matches server order record exactly. |
| **WA-007** | Customer details in message | `IMPLEMENTED` | Customer Name, Mobile, Email, and Full Delivery Address formatted cleanly. |
| **WA-008** | Add several items | `IMPLEMENTED` | Numbered list (1., 2., 3.) with line totals and variant details. |
| **WA-009** | Special characters (`&`, `+`, Unicode) | `IMPLEMENTED` | Encoded with standard `encodeURIComponent()` to prevent broken parameters. |
| **WA-010** | WhatsApp installed | `IMPLEMENTED` | `wa.me` deep link routes to WhatsApp client on mobile. |
| **WA-011** | WhatsApp unavailable | `IMPLEMENTED` | Falls back to WhatsApp Web or browser view. |
| **WA-012** | Popup blocked | `IMPLEMENTED` | Direct link with explicit CTA fallback provided on confirmation screen. |
| **WA-013** | Double-click CTA | `IMPLEMENTED` | Frontend idempotency guard prevents duplicate order generation. |
| **WA-014** | Merchant number configuration | `IMPLEMENTED` | Reads from `StoreSettings.whatsappCheckout.businessNumber` -> `NEXT_PUBLIC_WHATSAPP_NUMBER` -> default `919712460509`. |
| **WA-015** | Open WhatsApp but do NOT send | `IMPLEMENTED` | Invariant preserved: Order remains `awaiting_confirmation` and `unpaid`. |
| **WA-016** | Cancel/close WhatsApp | `IMPLEMENTED` | Order remains `awaiting_confirmation` and `unpaid`. |
| **WA-017** | Large order message | `IMPLEMENTED` | Compact, structured layout avoids URL length limits. |
| **WA-018** | Tampered client price in WhatsApp URL | `NOT_IMPLEMENTED` *(DEFECT)* | Checkout API used client price for message generation. *(Fixed during audit)*. |
| **WA-019** | Cross-platform URL behavior | `IMPLEMENTED` | Standard `https://wa.me/` supported across iOS, Android, macOS, Windows, Linux. |
| **WA-020** | Compare order reference with draft | `IMPLEMENTED` | `Order Reference: LVX-YYYY-XXXX` is identical in message and database. |
| **WA-021** | Secret leakage in WhatsApp URL | `IMPLEMENTED` | No tokens, hashes, API keys, or admin URLs included in message. |
| **WA-022** | Click tracking != confirmed sale | `IMPLEMENTED` | Analytics records event as `whatsapp_handoff_initiated`, never `sale_completed`. |
| **WA-023** | Retry after connection loss | `IMPLEMENTED` | Order ID can be reused; avoids duplicate pending orders. |
| **WA-024** | Currency formatting | `IMPLEMENTED` | Indian numbering system `en-IN` with `₹` symbol (e.g. `₹1,098`). |
| **WA-025** | Message privacy | `IMPLEMENTED` | Only shipping details and ordered items included; no internal user IDs. |

---

### J. Account, Profile & Admin Integration (ACCOUNT & ADMIN)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **ACCOUNT-001** | Open profile as auth user | `IMPLEMENTED` | `/account` loads user profile and addresses. |
| **ACCOUNT-002** | Open profile as guest | `IMPLEMENTED` | Redirects to login with return URL. |
| **ACCOUNT-003** | Update profile fields | `IMPLEMENTED` | `PATCH /api/auth/profile` updates name, phone, addresses. |
| **ACCOUNT-004** | Open another user's order URL | `IMPLEMENTED` | Blocked with 401 or 403; IDOR protected. |
| **ACCOUNT-005** | Show order history | `IMPLEMENTED` | Scoped to `{ customer: user.id }`. |
| **ADMIN-001** | Create draft product | `IMPLEMENTED` | Payload drafts enabled (`versions: { drafts: true }`). |
| **ADMIN-002** | Publish product | `IMPLEMENTED` | Becomes visible upon `_status: 'published'`. |
| **ADMIN-003** | Update price in admin | `IMPLEMENTED` | Changes reflected across catalog and checkout. |
| **ADMIN-004** | Update stock | `IMPLEMENTED` | Changes reflected in real-time inventory validation. |
| **ADMIN-005** | Disable product | `IMPLEMENTED` | Inactive product cannot be purchased. |
| **ADMIN-006** | Manage coupons in admin | `IMPLEMENTED` | Payload `Coupons` collection admin UI. |
| **ADMIN-007** | Upload valid image to R2 | `IMPLEMENTED` | Stored in Cloudflare R2 bucket `lovixa`. |
| **ADMIN-008** | Upload forbidden file type | `IMPLEMENTED` | MIME type whitelist in `Media.ts` blocks non-image files. |
| **ADMIN-009** | Customer role accesses admin | `NOT_IMPLEMENTED` *(DEFECT)* | Admin access rule missing in `Users.ts`. *(Fixed during audit)*. |
| **ADMIN-010** | Concurrent admin stock edits | `IMPLEMENTED` | Atomic database updates. |
| **ADMIN-011** | R2 upload failure | `IMPLEMENTED` | Handled gracefully without orphaned media records. |
| **ADMIN-012** | Database unavailable | `IMPLEMENTED` | Returns clean 500 error; zero false order creation. |

---

### K. Responsive UI & Accessibility (UI)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **UI-001** | 280–375 px viewports | `IMPLEMENTED` | Mobile layouts tested with Tailwind flex-wrap and responsive typography. |
| **UI-002** | 390–430 px viewports | `IMPLEMENTED` | iPhone standard viewports render cleanly without horizontal overflow. |
| **UI-003** | 768 px viewports | `IMPLEMENTED` | Tablet grid shifts from 1 to 2 columns smoothly. |
| **UI-004** | 1024 px viewports | `IMPLEMENTED` | Desktop navigation bar and sidebar filters activate. |
| **UI-005** | 1440 px viewports | `IMPLEMENTED` | Max container `max-w-7xl mx-auto` maintains balanced margins. |
| **UI-006** | 1920–2500 px viewports | `IMPLEMENTED` | Contained layout prevents ultra-wide stretching. |
| **UI-007** | Product cards consistency | `IMPLEMENTED` | Uniform image aspect ratios and alignment across cards. |
| **UI-008** | Cart drawer clipping | `IMPLEMENTED` | Fixed drawer with `overflow-y-auto` and sticky checkout footer. |
| **UI-009** | Login modal focus & escape | `IMPLEMENTED` | Modal traps focus and closes with Escape key / backdrop click. |
| **UI-010** | Skeleton loading layout shift | `IMPLEMENTED` | Skeleton placeholders match rendered dimensions (low CLS). |
| **UI-011** | Form error accessibility | `IMPLEMENTED` | Inputs have accessible error labels and red borders on invalid states. |
| **UI-012** | Keyboard navigation | `IMPLEMENTED` | Full tab order across interactive links, buttons, and form inputs. |
| **UI-013** | Screen reader semantics | `IMPLEMENTED` | Native `<button>`, `<nav>`, `<main>`, `<header>`, `<footer>` elements used. |
| **UI-014** | Image alt text | `IMPLEMENTED` | Required `alt` field on Media collection and meaningful alt attributes on all images. |
| **UI-015** | Color contrast (WCAG 2.2 AA) | `IMPLEMENTED` | Deep botanical plum `#2B1822` on light rose `#FBF6F8` achieves > 10:1 contrast ratio. |
| **UI-016** | 200% Zoom | `IMPLEMENTED` | Responsive rem/em text scaling prevents content loss. |
| **UI-017** | High contrast / dark mode | `IMPLEMENTED` | High contrast tokens maintain legibility. |
| **UI-018** | Slow network loading | `IMPLEMENTED` | Next.js loading spinners and disabled button states during fetching. |
| **UI-019** | Cross-browser compatibility | `IMPLEMENTED` | Standard ES2022 + CSS flexbox/grid tested across modern browsers. |
| **UI-020** | Sticky header/footer overlap | `IMPLEMENTED` | Header uses `sticky top-0 z-40` with appropriate body offset. |
| **UI-021** | Reduced motion preference | `IMPLEMENTED` | CSS `motion-reduce:` guards in animations. |
| **UI-022** | Mobile tap targets | `IMPLEMENTED` | Minimum 44x44px touch targets on buttons and links. |
| **UI-023** | Focus management on route change | `IMPLEMENTED` | Scroll to top on navigation. |
| **UI-024** | Orientation change | `IMPLEMENTED` | Fluid Tailwind percentages adapt between portrait and landscape. |

---

### L. Security, API & Database (SEC)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **SEC-001** | Request another user's records | `IMPLEMENTED` | Payload Users access control enforces `{ id: { equals: user.id } }`. |
| **SEC-002** | Call Payload admin unauthorized | `NOT_IMPLEMENTED` *(DEFECT)* | Admin panel access rule missing on `Users.ts`. *(Fixed during audit)*. |
| **SEC-003** | Tamper product price in API payload | `NOT_IMPLEMENTED` *(DEFECT)* | Checkout API trusted client price. *(Fixed during audit)*. |
| **SEC-004** | Tamper coupon amount in API payload | `NOT_IMPLEMENTED` *(DEFECT)* | Checkout API trusted client discount. *(Fixed during audit)*. |
| **SEC-005** | NoSQL query injection | `IMPLEMENTED` | Inputs cast to strings or numbers before Mongoose query evaluation. |
| **SEC-006** | XSS in address/name/search | `IMPLEMENTED` | React JSX auto-escapes all text nodes; no `dangerouslySetInnerHTML` on customer inputs. |
| **SEC-007** | CSRF protection | `IMPLEMENTED` | Next.js App Router SameSite cookies (`sameSite: 'lax'`) + JSON content-type requirement. |
| **SEC-008** | Burst request rate limits | `NOT_IMPLEMENTED` *(DEFECT)* | `/api/auth/login` lacked rate limiting; checkout and coupons have limits. *(Fixed during audit)*. |
| **SEC-009** | Secret leakage in client bundle | `IMPLEMENTED` | Verified: No server secrets (`PAYLOAD_SECRET`, `R2_SECRET_ACCESS_KEY`, etc.) prefixed with `NEXT_PUBLIC_`. |
| **SEC-010** | Unauthorized R2 upload | `IMPLEMENTED` | `Media.access.create` strictly blocks anonymous users and customer role. |
| **SEC-011** | Upload invalid file type | `IMPLEMENTED` | MIME type whitelist enforced in `Media.upload.mimeTypes`. |
| **SEC-012** | Database connection failure | `IMPLEMENTED` | Doctor script tests DB reachability; graceful error handling in routes. |
| **SEC-013** | Race condition in stock | `IMPLEMENTED` | Real-time stock revalidation in `validateItemsStock()` prior to order write. |
| **SEC-014** | Retry identical order | `IMPLEMENTED` | Supports `existingOrderId` reuse to prevent duplicate records. |
| **SEC-015** | Privileged admin API as customer | `NOT_IMPLEMENTED` *(DEFECT)* | `Users.ts` lacked admin access restriction. *(Fixed during audit)*. |
| **SEC-016** | Expire/rotate session | `IMPLEMENTED` | JWT token expiration and invalidation on logout. |
| **SEC-017** | Logs / error secret scrubbing | `IMPLEMENTED` | R2 diagnostics and error logs redact secrets and account IDs. |
| **SEC-018** | Apply coupon via direct API | `IMPLEMENTED` | `/api/coupons/validate` validates against database rules. |
| **SEC-019** | Order unpublished product via API | `IMPLEMENTED` | Stock checker rejects invalid or unpublished product IDs. |
| **SEC-020** | Malformed JSON / invalid types | `IMPLEMENTED` | Handled safely in `try/catch` returning 400 Bad Request. |
| **SEC-021** | Security headers & CSP | `IMPLEMENTED` | `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, `Referrer-Policy` in `next.config.mjs`. |
| **SEC-022** | Untrusted CORS | `IMPLEMENTED` | Same-origin API routes without wildcards. |
| **SEC-023** | Mass assignment on user/order | `IMPLEMENTED` | `register` hardcodes `role: 'customer'`; `Users.fields.role` restricts updates to admin. |
| **SEC-024** | ID enumeration | `IMPLEMENTED` | Direct ID lookup blocked by authorization check. |
| **SEC-025** | Webhooks security | `IMPLEMENTED` | Stripe webhook validates cryptographic signature (`stripe.webhooks.constructEvent`). |
| **SEC-026** | Dependency vulnerabilities | `IMPLEMENTED` | pnpm audit review and modern packages. |

---

### M. SEO, Performance & Analytics (SEO, PERF, ANALYTICS)

| Test ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **SEO-001** | Title / description per route | `IMPLEMENTED` | Defined in `(store)/layout.tsx`, `products/page.tsx`, `products/[slug]/page.tsx`. |
| **SEO-002** | Canonical & robots directives | `IMPLEMENTED` | [`src/app/robots.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/robots.ts) disallows `/admin/`, `/api/`, `/checkout`, `/cart`. |
| **SEO-003** | Sitemap XML | `IMPLEMENTED` | [`src/app/sitemap.ts`](file:///c:/Users/bhuva/OneDrive/Desktop/Lovixa_Website/src/app/sitemap.ts) generates canonical URLs for all active products, categories, static pages. |
| **SEO-004** | Product structured data | `IMPLEMENTED` | JSON-LD schema on product pages. |
| **SEO-005** | 404 / unpublished pages | `IMPLEMENTED` | Custom not-found pages return 404 status. |
| **SEO-006** | OG / Social metadata | `IMPLEMENTED` | OpenGraph & Twitter card image (`lovixa-og.jpg`) configured in StoreLayout metadata. |
| **PERF-001** | Route budgets | `IMPLEMENTED` | Force dynamic SSR where needed; static assets cached. |
| **PERF-002** | Core Web Vitals | `IMPLEMENTED` | Font display swap, Next.js image optimization (`avif`, `webp`). |
| **PERF-003** | Image sizes & lazy loading | `IMPLEMENTED` | Responsive sizes attribute, priority on hero, lazy on catalog. |
| **PERF-004** | Duplicate API requests | `IMPLEMENTED` | Zustand single-store pattern prevents redundant fetch calls. |
| **PERF-005** | API timeout simulation | `IMPLEMENTED` | Graceful try/catch with UI error recovery. |
| **PERF-006** | R2 image fallback | `IMPLEMENTED` | Local fallback path when R2 is in placeholder mode or image fails. |
| **PERF-007** | Database failure resilience | `IMPLEMENTED` | Error boundaries prevent false checkout success. |
| **PERF-008** | Hydration & runtime errors | `IMPLEMENTED` | `suppressHydrationWarning` on root; zero hydration errors on key pages. |
| **ANALYTICS-001** | Add to cart event | `IMPLEMENTED` | Dispatches single event on user action. |
| **ANALYTICS-002** | WhatsApp click event | `IMPLEMENTED` | Tagged as `whatsapp_handoff_initiated`, explicitly not marked as confirmed sale. |
| **ANALYTICS-003** | Privacy in analytics | `IMPLEMENTED` | No passwords, tokens, or raw payment details sent to analytics. |

---

### N. End-to-End Scenarios (E2E)

| Flow ID | Scenario | Status | Code Evidence / Implementation Details |
|---|---|---|---|
| **E2E-001** | Guest -> Home -> Product -> Cart -> Address -> WhatsApp | `IMPLEMENTED` | Complete guest journey validated end-to-end. |
| **E2E-002** | Register/Login -> Wishlist -> Cart -> Checkout | `IMPLEMENTED` | Authenticated customer flow with account isolation. |
| **E2E-003** | Oil + Shampoo -> Edit Qty -> Coupon -> WhatsApp | `IMPLEMENTED` | Validates multi-item cart, quantity modifications, discount calculation, and WhatsApp URL. |
| **E2E-004** | Combo -> Discount -> Shipping -> WhatsApp | `IMPLEMENTED` | Validates combo SKU, discount application, shipping threshold (₹999), and WhatsApp message. |
| **E2E-005** | Coupon expires after cart addition | `IMPLEMENTED` | Server-side checkout revalidation catches and rejects expired coupons. |
| **E2E-006** | Price / stock change before checkout | `IMPLEMENTED` | Real-time stock and price verification at `/api/checkout`. |
| **E2E-007** | Open WhatsApp then cancel / do not send | `IMPLEMENTED` | Strict invariant: order remains `awaiting_confirmation` and `unpaid`. |
| **E2E-008** | User A -> Logout -> User B | `IMPLEMENTED` | Wishlist and order history strictly isolated between accounts. |
| **E2E-009** | Mobile 320px -> Cart -> Checkout | `IMPLEMENTED` | Narrow mobile layout renders without clipping or overflow. |
| **E2E-010** | R2 / API / DB failure handling | `IMPLEMENTED` | Clean 500 error, zero partial corruption, zero false order creation. |
| **E2E-011** | Repeated checkout clicks | `IMPLEMENTED` | Button disable guard + backend order reuse prevents duplicates. |
| **E2E-012** | Admin updates product/coupon in staging | `IMPLEMENTED` | Cache invalidation immediately propagates changes to storefront. |
