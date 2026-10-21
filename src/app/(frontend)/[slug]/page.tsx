import React from 'react'
import { notFound } from 'next/navigation'
import { getHeaderFooterForLayout, getMappedCollectionDoc } from '@/lib/cms/queries'
import { LivePreviewWrapper } from '@/components/cms/LivePreviewWrapper'
import { SITE_NAME, SITE_URL } from '@/lib/seo-constants'
import { resolveSeoDescription, resolveSeoImage, resolveSeoTitle } from '@/lib/seo-meta'

export const revalidate = 3600

/** One page per `other-pages` doc, at /{slug} — see src/collections/OtherPages.ts. */
const COLLECTION_SLUG = 'other-pages'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ preview?: string }>
}

async function getPageData(slug: string, options?: { draft?: boolean }) {
  return getMappedCollectionDoc(COLLECTION_SLUG, COLLECTION_SLUG, slug) as Promise<{
    id?: unknown
    title?: string
    hero?: { title?: string; subtitle?: string; accentColor?: string }
    sections?: { blockType?: string; id?: string; clientId?: string }[]
    meta?: { title?: string; description?: string; image?: unknown }
  } | null>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const pageData = await getPageData(slug)
  if (!pageData) return {}

  const fallbackTitle = pageData.hero?.title || pageData.title || SITE_NAME
  const fallbackDescription = pageData.hero?.subtitle || 'Welcome to our site.'

  const title = resolveSeoTitle(pageData.meta?.title, fallbackTitle)
  const description = resolveSeoDescription(pageData.meta?.description, fallbackDescription)
  const image = resolveSeoImage(pageData.meta?.image, '')
  const canonical = `${SITE_URL}/${slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default async function OtherPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const isPreview = resolvedSearchParams?.preview === 'true'
  const pageData = await getPageData(slug, { draft: isPreview })

  // Draft/Publish: an unpublished (or nonexistent) doc never renders on the
  // frontend. See 19-draft-publish-workflow.md.
  if (!pageData) return notFound()

  const { themeSettings } = await getHeaderFooterForLayout()
  const fallbackAccent = (themeSettings as any)?.primaryColor || 'var(--color-brand-500)'

  return (
    <main>
      <LivePreviewWrapper
        initialData={pageData}
        fallbackAccentColor={fallbackAccent}
        breadcrumbTitle={pageData.title || slug}
        breadcrumbPath={`/${slug}`}
      />
    </main>
  )
}
