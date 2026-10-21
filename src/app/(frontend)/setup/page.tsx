import type { Metadata } from 'next'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import SetupForm from './SetupForm'

// Never indexed, never in sitemap — this route is meant to be found only via
// the direct URL the operator was given. See starter-kit/24-github-deploy-and-setup.md.
export const metadata: Metadata = {
  title: 'Setup',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

export default async function SetupPage() {
  const payload = await getPayloadCached()
  const existing = await payload.count({ collection: 'users', overrideAccess: true })
  const alreadyDone = existing.totalDocs > 0

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      {alreadyDone ? (
        <div>
          <h1 className="text-h4 font-heading text-foreground">Setup already completed</h1>
          <p className="mt-2 text-body-sm text-neutral-400">
            An admin user already exists. Go to <a href="/admin" className="underline">/admin</a> to log in.
          </p>
        </div>
      ) : (
        <SetupForm />
      )}
    </main>
  )
}
