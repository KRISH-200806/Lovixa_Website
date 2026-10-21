# Architecture Decision Records (ADR) — Lovixa Frontend

This document formally records all frontend architectural and engineering decisions for the Lovixa luxury cosmetics e-commerce platform.

---

## ADR-F001: Client SPA Architecture with Lazy Loading & Code Splitting
- **Status:** Accepted
- **Context:** An e-commerce platform requires high visual appeal, swift product exploration, and seamless shopping cart updates without full page reloads.
- **Decision:** Use React 19 with Vite 6, using client-side routing (React Router v7) and chunked dynamic imports for heavier components.
- **Consequences:** Near instantaneous page changes, clean state management, modular deployment, and high Lighthouse performance score.

---

## ADR-F002: Centralized Design Token System & Primitive UI Layer
- **Status:** Accepted
- **Context:** Inconsistent colors, margins, fonts, and button sizes degrade perceived brand luxury.
- **Decision:**
  - Define root CSS variables for core palette:
    - Primary Gold: `#b4945e` / `#c5a979`
    - Deep Charcoal / Onyx: `#111827` / `#0f172a`
    - Backgrounds: `#faf8f5` (warm ivory) / `#ffffff`
    - Muted grays, rose accents, and gold glassmorphism gradients.
  - Implement reusable primitives in `src/components/ui/` (`Button`, `Input`, `Card`, `Modal`, `Badge`, `Skeleton`, `ErrorBoundary`).
- **Consequences:** Changes to brand guidelines propagate automatically; components remain maintainable and decoupled from business logic.

---

## ADR-F003: Isolated State & Optimistic UI Updates
- **Status:** Accepted
- **Context:** Mixing server caching with client UI states often causes race conditions, phantom carts, and desynchronized user profiles.
- **Decision:**
  - **AuthContext:** Holds user profile, JWT authentication state, and session listeners.
  - **CartContext:** Holds cart items, quantities, pricing totals, and local storage fallback for guest checkout.
  - **Optimistic UI:** When users increment/decrement items or add to cart, the UI reflects the change immediately while syncing with backend APIs in the background.
- **Consequences:** Smooth, lag-free user experience even on slower mobile networks.

---

## ADR-F004: Centralized API Client & JWT Interceptor
- **Status:** Accepted
- **Context:** Multiple scattered API fetch calls cause inconsistent authorization headers, uncaught error responses, and session dropouts.
- **Decision:**
  - Single configured Axios instance (`src/Axios/axiosInstance.js`) referencing `VITE_API_BASE_URL`.
  - Automatic `Authorization: Bearer <token>` attachment.
  - 401 response interceptor with token refresh queue: when token expires, it requests a new access token using `refresh`, updates storage, and retries pending requests automatically without kicking the user out.
- **Consequences:** Rock-solid session management and predictable API communication.

---

## ADR-F005: Quad-State UI Pattern (Loading, Error, Empty, Success)
- **Status:** Accepted
- **Context:** Blank screens and raw error traces frustrate users and reduce conversion rates.
- **Decision:** Every component that fetches data explicitly implements:
  1. `Loading`: Shimmer/pulse skeleton components tailored to the layout.
  2. `Error`: User-friendly alert box with a retry button.
  3. `Empty`: Polished illustration/icon indicating no data (e.g. empty cart, zero search results) with an action button.
  4. `Success`: Clean render of data.
- **Consequences:** Elimination of undefined crashes and elevated user satisfaction.

---

## ADR-F006: Frontend Security & Input Sanitization
- **Status:** Accepted
- **Context:** User inputs (reviews, addresses, search terms) and sensitive JWT tokens require strict protection against XSS and leakage.
- **Decision:**
  - Prevent raw HTML injections.
  - Strict input validation before network submission.
  - Automatic purge of sensitive tokens upon logout or invalid refresh token responses.
  - `rel="noopener noreferrer"` enforced on all external URLs.
- **Consequences:** Enhanced client-side security posture meeting modern standards.

---

## ADR-F007: Performance & Core Web Vitals
- **Status:** Accepted
- **Context:** High load times increase bounce rates on e-commerce sites.
- **Decision:**
  - Asset optimization and responsive images with fallback handling.
  - Dynamic font swapping (`Urbanist`, `Poppins`).
  - Minimized bundle size via Vite tree-shaking.
- **Consequences:** Smooth 60fps animations and fast Time-to-Interactive.

---

## ADR-F008: Comprehensive Automated Testing
- **Status:** Accepted
- **Context:** Manual testing cannot guarantee zero regressions during feature releases.
- **Decision:**
  - Vitest + React Testing Library + JSDOM for unit, component, context, and end-to-end user shopping flows.
  - Full mocking of network APIs, localStorage, and router context.
- **Consequences:** Automated test validation prior to builds and deployments.
