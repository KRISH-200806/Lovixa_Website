# Test Suite Specification & User Flow Matrix — Lovixa Frontend

This document outlines the complete automated test plan, module-wise test cases, and user shopping flow tests for the Lovixa frontend application.

---

## 1. Test Architecture & Framework Setup

- **Runner:** Vitest
- **DOM Environment:** JSDOM
- **Testing Utilities:** `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- **Global Setup:** `src/test/setup.js` (Mocks for window.matchMedia, IntersectionObserver, scrollTo, and localStorage)

---

## 2. Test Modules Matrix

| Module | Test File | Key Test Cases Covered |
|---|---|---|
| **Module 1: UI Primitives & Foundation** | `src/test/uiComponents.test.jsx` | Button variants & loading spinner, Input text change & error state, Card rendering, Modal open/close & backdrop click, Badge color styles, Skeleton pulse animation, ErrorBoundary crash catch & fallback UI. |
| **Module 2: Centralized API Client** | `src/test/apiClient.test.js` | Base URL resolution, Authorization header injection, request timeout, 401 error interception & refresh queue retry mechanism, logout on failed refresh. |
| **Module 3: Authentication Flow** | `src/test/authContext.test.jsx` | Initial token load from localStorage, login with valid credentials, login error handling, registration flow, profile fetching, logout event broadcast. |
| **Module 4: Cart State & Optimistic UI** | `src/test/cartContext.test.jsx` | Adding items to cart, updating quantity, removing items, calculating totals & taxes, guest checkout localStorage persistence, backend synchronization. |
| **Module 5: Navigation & Search** | `src/test/navbarAndNavigation.test.jsx` | Brand logo link, category navigation links, search debounce & dropdown results, cart counter badge update, mobile navigation drawer toggle. |
| **Module 6: Product Listing & Detail** | `src/test/productAndListing.test.jsx` | Product card rendering (price, discount, rating, image), ProductPage detail view (image gallery switch, variant selection, stock check, add to cart button). |
| **Module 7: Checkout & Payment** | `src/test/checkoutAndPayment.test.jsx` | Shipping address validation (name, phone, address, pincode, city, state), payment method selection (UPI/COD/Card), order total breakdown, anti-duplicate click protection on submit. |
| **Module 8: Static Pages & Accordion** | `src/test/staticPages.test.jsx` | FAQ accordion toggle open/close, Privacy policy, Terms, Refund policy, About Us content rendering, Footer social & policy links. |
| **Module 9: Full User Shopping Flow** | `src/test/userFlows.test.jsx` | Complete end-to-end user journey: Visit home -> Browse products -> Open product detail -> Select size/variant -> Add to cart -> View Cart Panel -> Proceed to checkout -> Fill address -> Complete order. |

---

## 3. How to Execute Test Suites

```bash
# Run all tests once
npm run test

# Run tests in watch mode during development
npm run test:watch

# Run specific test file
npx vitest run src/test/userFlows.test.jsx
```
