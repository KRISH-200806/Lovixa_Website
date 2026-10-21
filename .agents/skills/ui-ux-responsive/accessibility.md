# Accessibility

Mandatory, not optional polish. Follow WCAG basics on every UI change.

## Semantic HTML

Prefer `<header>` `<nav>` `<main>` `<section>` `<article>` `<aside>` `<footer>` `<button>` `<a>` `<form>` `<label>` over generic `<div>`. A clickable `<div>` is wrong when a `<button>` or `<a>` fits — you lose keyboard activation, focus, and screen-reader semantics for free otherwise.

```tsx
// ❌
<div onClick={submit} className="...">Submit</div>

// ✅
<button onClick={submit} className="...">Submit</button>
```

## Checklist

- Keyboard: everything interactive is reachable and operable via Tab/Enter/Space without a mouse.
- Focus: visible focus state on every interactive element (`Button`'s underlying element keeps native focus ring unless replaced — never `outline-none` without a real replacement).
- Contrast: text against `neutral-*`/`brand-*` backgrounds stays readable — check against this project's dark-first palette (`--background: #000000`) especially for `neutral-400`/`500` muted text on dark surfaces.
- Heading hierarchy: one `h1` per page, no skipped levels — remember `Heading`'s `as` (semantic) can differ from `size` (visual), so hierarchy stays correct even when visual scale doesn't match document order.
- Images: meaningful `alt` text for content images, empty `alt=""` for decorative ones (never omit `alt` entirely).
- Forms: labels bound via `htmlFor`/`id`, errors linked via `aria-describedby`, `aria-invalid` on invalid fields.
- Dialogs/dropdowns/tabs: correct `aria-*` roles/states, focus trapped in open modals, focus returned to the trigger on close, `Escape` closes.
