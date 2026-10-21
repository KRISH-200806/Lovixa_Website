import type { Access } from 'payload'

/**
 * Public read access for marketing content and assets served to anonymous site visitors.
 * Same behavior as `read: () => true` — centralized so policy can evolve in one place.
 */
export const publicRead: Access = () => true

/**
 * Authenticated CMS user only (any logged-in user).
 * Same behavior as `read: ({ req: { user } }) => Boolean(user)`.
 */
export const staffOnly: Access = ({ req: { user } }) => Boolean(user)

/**
 * Allow unauthenticated creates (forms, uploads) while keeping reads/writes staff-only when paired with `staffOnly`.
 */
export const publicCreate: Access = () => true

/**
 * Public read that excludes drafts for unauthenticated requests — pair with
 * `versions: { drafts: true }` on any collection/global that should support
 * draft/publish. Logged-in users (admin/preview) still see drafts; anonymous
 * requests (the public frontend, direct REST/GraphQL hits) only ever see
 * `_status: 'published'` docs. This is defense-in-depth for the public API
 * surface — the Local API's default `draft: false` behavior already filters
 * drafts for the frontend's own cached reads. See starter-kit/19-draft-publish-workflow.md.
 */
export const publicReadPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
