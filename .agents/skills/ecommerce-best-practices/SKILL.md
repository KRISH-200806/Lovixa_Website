---
name: ecommerce-best-practices
description: Standards, conventions, and architectural best practices for Next.js + Payload CMS E-Commerce stores
---

# E-Commerce Best Practices Skill

## Purpose
This skill provides comprehensive instructions for designing, extending, and maintaining modern e-commerce stores on Next.js 15 (App Router) + Payload CMS 3.

## Architectural Guidelines

### 1. Product Catalog & Variant Handling
- Products maintain parent metadata (title, brand, categories, rich descriptions, gallery).
- ProductVariants store skus, specific pricing, variant options (Color, Size, Material), and inventory quantities.
- When querying a product page, always populate the active variants and sort options consistently.

### 2. Cart Architecture
- Support both guest visitors (via signed session cookie / local storage) and authenticated customers.
- When an anonymous user logs in, automatically merge their guest cart items into their customer account cart.
- Free shipping calculation must dynamically read `freeShippingThreshold` from `StoreSettings`.

### 3. Payment & Order Lifecycle
- Maintain explicit state machines for `paymentStatus` (`pending`, `paid`, `failed`, `refunded`) and `fulfillmentStatus` (`unfulfilled`, `processing`, `shipped`, `delivered`, `cancelled`).
- Never perform stock deductions or customer fulfillment purely on client-side confirmation. Always verify via authenticated webhook or server action.
