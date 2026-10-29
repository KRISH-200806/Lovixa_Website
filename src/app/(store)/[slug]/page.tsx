import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug, hasRichTextContent } from '@/lib/cms/pages'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type DynamicPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page || page.isPublished === false) {
    return {}
  }

  const title = page.seo?.metaTitle || page.title || `${page.title} — LOVIXA COSMETIC`
  const description =
    page.seo?.metaDescription ||
    page.subtitle ||
    `Read about ${page.title} at LOVIXA COSMETIC — Ayurvedic and Botanical Hair Care Essentials.`
  const canonicalUrl = page.seo?.canonicalUrl || `https://www.lovixacosmetic.com/${slug}`

  const ogImageUrl =
    (typeof page.seo?.ogImage === 'object' && page.seo?.ogImage?.url) ||
    (typeof page.headerImage === 'object' && page.headerImage?.url) ||
    page.headerImageUrl ||
    'https://www.lovixacosmetic.com/images/lovixa-og.jpg'

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: page.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function GenericDynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page || page.isPublished === false) {
    notFound()
  }

  const headerImg =
    (typeof page.headerImage === 'object' && page.headerImage?.url) ||
    page.headerImageUrl ||
    '/images/lovixa-panoramic-hero.jpg'

  const hasRichText = hasRichTextContent(page.content)
  const hasSections = Boolean(page.sections && page.sections.length > 0)

  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[{ label: page.title }]}
          badge={page.badge || 'LOVIXA COSMETIC'}
          title={page.title}
          highlightTitle={page.highlightTitle}
          subtitle={page.subtitle}
          imageSrc={headerImg}
          imageAlt={page.title}
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-8">
        {page.lastUpdated && (
          <div className="space-y-1 border-b border-[#E8C4D4]/60 pb-6">
            <p className="text-xs text-[#2B1822]/60 font-sans">
              Last Updated: {page.lastUpdated}
            </p>
          </div>
        )}

        {/* Dynamic Rich Text */}
        {hasRichText && (
          <div className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-8 sm:p-12 shadow-xs prose prose-stone max-w-none font-sans">
            <RichText data={page.content} />
          </div>
        )}

        {/* Structured Sections Fallback/Supplement */}
        {hasSections && (
          <div className="space-y-8 text-sm sm:text-base text-[#2B1822]/80 leading-relaxed font-sans">
            {page.sections!.map((sec, idx) => (
              <section key={sec.heading || idx} className="space-y-3">
                <h2 className="text-lg sm:text-xl font-sans font-bold text-[#2B1822] flex items-baseline gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6B2D5C] shrink-0" />
                  <span>{sec.heading}</span>
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-[#2B1822]/75 pl-4 sm:pl-5 border-l-2 border-[#E8C4D4]/40 font-sans">
                  {sec.content}
                </p>
              </section>
            ))}
          </div>
        )}

        {/* FAQ Accordions if attached to this page */}
        {page.faqItems && page.faqItems.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#E8C4D4]/60">
            <h3 className="text-xl font-bold font-sans text-[#2B1822]">
              Frequently Asked Questions
            </h3>
            {page.faqItems.map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-6 shadow-2xs space-y-2"
              >
                <h4 className="text-base font-bold text-[#2B1822] font-sans">
                  {faq.question}
                </h4>
                <p className="text-xs sm:text-sm text-[#2B1822]/75 leading-relaxed font-sans whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        <PolicyNavigation />
      </div>
    </div>
  )
}
