import type { Metadata } from 'next'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'
import { getPageBySlug, hasRichTextContent } from '@/lib/cms/pages'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('privacy-policy')
  return {
    title: page?.seo?.metaTitle || page?.title || 'Privacy Policy — LOVIXA COSMETIC',
    description:
      page?.seo?.metaDescription ||
      page?.subtitle ||
      'Understand how LOVIXA COSMETIC handles, protects, and respects your personal customer data.',
  }
}

export default async function PrivacyPolicyPage() {
  const page = await getPageBySlug('privacy-policy')

  const headerImg =
    (typeof page?.headerImage === 'object' && page?.headerImage?.url) ||
    page?.headerImageUrl ||
    '/images/lovixa-panoramic-hero.jpg'

  const hasRichText = hasRichTextContent(page?.content)
  const hasSections = Boolean(page?.sections && page.sections.length > 0)

  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[{ label: 'Privacy Policy' }]}
          badge={page?.badge || 'DATA INTEGRITY & TRUST'}
          title={page?.title || 'Data Privacy & Trust,'}
          highlightTitle={page?.highlightTitle || 'Your Privacy is Sacred to Us'}
          subtitle={
            page?.subtitle ||
            'Understand how LOVIXA COSMETIC handles, protects, and respects your personal customer data.'
          }
          imageSrc={headerImg}
          imageAlt={page?.title || 'LOVIXA Privacy Policy'}
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-8">
        <div className="space-y-1 border-b border-[#E8C4D4]/60 pb-6">
          <p className="text-xs text-[#2B1822]/60 font-sans">
            Last Updated: {page?.lastUpdated || 'October 2026 • LOVIXA COSMETIC'}
          </p>
        </div>

        {/* Dynamic Rich Text */}
        {hasRichText && (
          <div className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-8 sm:p-12 shadow-xs prose prose-stone max-w-none font-sans">
            <RichText data={page!.content} />
          </div>
        )}

        {/* Structured Sections */}
        {hasSections ? (
          <div className="space-y-8 text-sm sm:text-base text-[#2B1822]/80 leading-relaxed font-sans">
            {page!.sections!.map((sec, idx) => (
              <section key={sec.heading || idx} className="space-y-3">
                <h2 className="text-xl font-sans font-bold text-[#2B1822]">
                  {sec.heading}
                </h2>
                <div className="space-y-2 text-[#2B1822]/75 whitespace-pre-line">
                  {sec.content}
                </div>
              </section>
            ))}
          </div>
        ) : !hasRichText ? (
          <div className="space-y-8 text-sm sm:text-base text-[#2B1822]/80 leading-relaxed font-sans">
            <section className="space-y-3">
              <h2 className="text-xl font-sans font-bold text-[#2B1822]">
                1. Our Privacy Commitment
              </h2>
              <p>
                At LOVIXA COSMETIC, your privacy and trust are sacred. We collect only information that is strictly required to process your orders, ship your packages, and provide personalized customer assistance.
              </p>
            </section>
          </div>
        ) : null}

        <PolicyNavigation />
      </div>
    </div>
  )
}
