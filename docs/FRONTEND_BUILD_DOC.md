# Cosmetics E-commerce — Frontend Build & Architecture Specification (Lovixa)

**Framework & Stack:** React 19 + Vite 6 + Tailwind CSS 3, React Router 7, Axios (Centralized API Layer), Context State Management (Auth + Cart + Loading), Vitest + React Testing Library for End-to-End & Unit testing.
**Purpose:** Ensure a robust, SEO-friendly, secure, fully responsive, component-based frontend with state/error/loading management — matching the highest standards of luxury cosmetics e-commerce platforms.

---

## 1. Architecture Decisions (ADRs)

### ADR-F001: Rendering Strategy & Performance
- **Decision:** Client-Side Single Page Application (SPA) powered by Vite with component-level code splitting, asset optimization, lazy-loading for heavy submodules (e.g. video sections, modals), and preloaded critical assets.
- **Why:** Delivers sub-second route transitions, instant responsiveness, and high Core Web Vitals performance (LCP < 2.5s, CLS < 0.1, INP < 200ms).

### ADR-F002: Centralized Component Architecture & Design Tokens
- **Decision:** Strict centralized design-token theme (luxury gold `#b4945e`, deep onyx, soft champagne backgrounds, rose accents, typography with `Urbanist` & `Poppins`) configured in CSS variables and Tailwind theme extensions.
- **Component structure:**
  - `src/components/ui/` – Pure, reusable primitives (Button, Input, Card, Modal, Badge, Skeleton, ErrorBoundary) with zero scattered business logic.
  - `src/components/layout/` & `src/components/Navbar/` / `Footer/` – Layout containers, sticky headers, mega-menus, and mobile navigation drawer.
  - `src/components/features/` (or domain folders) – Composed features (`ProductCard`, `CartPanel`, `Checkout`, `ReviewSystem`, `BestSellers`).
  - `src/App.jsx` – Clean route orchestration with fallback layouts and error handling.

### ADR-F003: State Management & Isolation
- **Decision:** Split state by domain responsibility:
  - **Server/remote data** (products, categories, orders, user profile): Centralized API client with standard response parsing and loading states.
  - **Client UI state** (search popups, cart drawer open/close, mobile nav toggle): Local component state and lightweight React Contexts.
  - **Cart & Auth state:** Synchronized between client storage and backend server. Backend is the source of truth; client optimistic cache ensures zero lag for users.

### ADR-F004: Centralized API Layer
- **Decision:** All requests flow through `src/Axios/axiosInstance.js` / `src/lib/api/`:
  - Dynamically configured `baseURL` from `.env` (`VITE_API_BASE_URL`).
  - Automatic `Bearer` token injection on outgoing requests.
  - Transparent 401 token refresh interceptor with queue locking (no mid-session unexpected logouts).
  - Standardized error transformation into human-friendly messages.

### ADR-F005: Explicit Loading & Error States
- **Decision:** Every data-dependent UI section handles 4 explicit states:
  1. `loading` — Animated luxury skeleton loaders.
  2. `error` — Friendly, actionable error messages with retry actions.
  3. `empty` — Custom empty-state illustrations with shopping CTAs.
  4. `success` — Rich rendered data.

### ADR-F006: Frontend Security
- **Decision:**
  - Secure token storage with automatic session recovery and cleanup.
  - Client-side data sanitization to prevent XSS.
  - Client-side form validation (email format, password strength, required fields, numeric constraints) coupled with server-side validation messages.
  - Environment variables strictly segregated (`VITE_*` public variables vs private backend secrets).

### ADR-F007: Performance & Image Optimization
- **Decision:**
  - Lazy loading for images and video banners.
  - Responsive image scaling (`max-width: 100%`, explicit aspect ratios) to prevent Layout Shifts (CLS).
  - Modern typography loaded with `font-display: swap`.

### ADR-F008: SEO & Accessibility (a11y)
- **Decision:**
  - Dynamic page titles and meta tags per route.
  - JSON-LD structured schema for `Product`, `Organization`, and `BreadcrumbList`.
  - Accessible touch targets (min 44px) and keyboard navigable interactive elements.

---

## 2. Module-by-Module Implementation Matrix

1. **Module 1: Foundation**
   - Theme tokens, CSS variables, base UI component library (`Button`, `Input`, `Card`, `Badge`, `Modal`, `Skeleton`, `ErrorBoundary`), centralized API client with 401 refresh queue.
2. **Module 2: Authentication (UI & State)**
   - Login, registration, forgot password, reset password with inline validation, loading states, and toast notifications.
3. **Module 3: Category & Navigation**
   - Sticky navbar, category dropdown/chips, debounced search modal with live preview, mobile menu drawer, cart badge count.
4. **Module 4: Product Listing & Detail**
   - Responsive product grid, category filtering, sort options, product detail page with image gallery thumbnails, variant selectors, stock badge, customer ratings & reviews.
5. **Module 5: Cart Management**
   - Slide-out cart drawer, add-to-cart animations, quantity increment/decrement, remove item, subtotal/shipping calculations, guest to auth sync.
6. **Module 6: Wishlist & Favorites**
   - Toggle wishlist state, saved items management.
7. **Module 7: Checkout & Payment**
   - Delivery address form with validation, order summary breakdown, payment mode selector (UPI, COD, NetBanking, Cards), double-click / duplicate order prevention.
8. **Module 8: Order History & Tracking**
   - Order confirmation screen, order timeline, itemized invoice view.
9. **Module 9: Static & Informational Pages**
   - About Us, Contact Us, Privacy Policy, Terms of Service, Return/Refund Policy, FAQ accordion, Perfume Marketing showcase.
10. **Module 10: Cross-Cutting Final Pass**
    - Full responsive verification (Mobile < 640px, Tablet 640–1024px, Desktop > 1024px), a11y compliance, zero console errors, automated test suites execution.

---

## 3. Responsive & Device Checklist

- [x] Mobile (< 640px), Tablet (640–1024px), Desktop (> 1024px) verified with zero horizontal overflow.
- [x] Touch targets exceed 44px tap area.
- [x] Responsive images with preserved aspect ratio and smooth placeholder loading.
- [x] Full mobile navigation drawer with backdrop blur.
- [x] Forms fully usable on mobile virtual keyboards.

---

## 4. State, API & Error Handling Rules

- [x] All requests routed via centralized Axios instance.
- [x] Explicit handling for `loading`, `error`, `empty`, `success`.
- [x] Skeleton loaders prevent layout flashing.
- [x] Friendly error messages with retry options.
- [x] Anti-double-submit protection on all cart and checkout buttons.
- [x] Transparent JWT refresh token handling.

---

## 5. Security Checklist

- [x] No secrets committed in client repository.
- [x] Inputs sanitized before render.
- [x] External links configured with `rel="noopener noreferrer"`.
- [x] Safe JWT storage with automatic logout on token expiry.

---

## 6. How to Run & Verify

```bash
# Run Development Server
npm run dev

# Run Production Build
npm run build

# Run Full Test Suite
npm run test
```
