# Public assets

Placeholder branding already ships here — replace, don't add from scratch:

- `favicon.ico` + `icon.svg` — placeholder site icon. Swap these two files with your real favicon (keep the same filenames, or update the `icons` entry in `src/app/(frontend)/layout.tsx`).
- `branding/placeholder-logo.svg` — seed source for the logo shown in `/admin` → Header on first-run `/setup`. Not served directly; replace the logo via `/admin` → Header → Logo (upload a real one there), not by editing this file. See `starter-kit/26-default-branding.md`.
- `media-placeholder.svg` — do not touch. Runtime fallback rendered by `SafeImage` when a CMS image fails to load or is unset. See `starter-kit/25-error-handling-and-asset-fallback.md`.
