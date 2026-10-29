import type { Metadata } from 'next'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'
import { getPageBySlug } from '@/lib/cms/pages'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('terms-conditions')
  return {
    title: page?.seo?.metaTitle || page?.title || 'Terms & Conditions — LOVIXA COSMETIC',
    description:
      page?.seo?.metaDescription ||
      page?.subtitle ||
      'Terms of service and purchasing conditions for LOVIXA COSMETIC website visitors and customers.',
  }
}

export default async function TermsConditionsPage() {
  const page = await getPageBySlug('terms-conditions')

  const headerImg =
    (typeof page?.headerImage === 'object' && page?.headerImage?.url) ||
    page?.headerImageUrl ||
    '/images/lovixa-panoramic-hero.jpg'

  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[{ label: 'Terms & Conditions' }]}
          badge={page?.badge || 'TERMS OF SERVICE'}
          title={page?.title || 'Transparency & Trust,'}
          highlightTitle={page?.highlightTitle || 'Terms of Service & Usage'}
          subtitle={
            page?.subtitle ||
            'Clear conditions and guidelines for shopping, browsing, and ordering at LOVIXA COSMETIC.'
          }
          imageSrc={headerImg}
          imageAlt={page?.title || 'LOVIXA Terms and Conditions'}
          priority
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-8">
        <div className="space-y-1 border-b border-[#E8C4D4]/60 pb-6">
          <p className="text-xs text-[#2B1822]/60 font-sans">
            Last Updated: {page?.lastUpdated || 'October 2026 • LOVIXA COSMETIC'}
          </p>
        </div>

        {/* Dynamic Rich Text or Structured Sections */}
        {page?.content ? (
          <div className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-8 sm:p-12 shadow-xs prose prose-stone max-w-none font-sans">
            <RichText data={page.content} />
          </div>
        ) : (
          <div className="space-y-8 text-sm sm:text-base text-[#2B1822]/80 leading-relaxed font-sans">
            {page?.sections && page.sections.length > 0 ? (
              page.sections.map((sec, idx) => (
                <section key={sec.heading || idx} className="space-y-3">
                  <h2 className="text-xl font-sans font-bold text-[#2B1822]">
                    {sec.heading}
                  </h2>
                  <div className="space-y-2 text-[#2B1822]/75 whitespace-pre-line">
                    {sec.content}
                  </div>
                </section>
              ))
            ) : (
              <section className="space-y-3">
                <h2 className="text-xl font-sans font-bold text-[#2B1822]">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing, browsing, or purchasing from LOVIXA COSMETIC, you agree to comply with and be bound by these Terms and Conditions.
                </p>
              </section>
            )}
          </div>
        )}

        <PolicyNavigation />
      </div>
    </div>
  )
}
