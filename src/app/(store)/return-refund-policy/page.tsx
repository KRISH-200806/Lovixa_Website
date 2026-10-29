import type { Metadata } from 'next'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'
import { getPageBySlug } from '@/lib/cms/pages'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('return-refund-policy')
  return {
    title: page?.seo?.metaTitle || page?.title || 'Return & Replacement Policy — LOVIXA COSMETIC',
    description:
      page?.seo?.metaDescription ||
      page?.subtitle ||
      'Understand the free transit damage replacement guidelines for LOVIXA products.',
  }
}

export default async function ReturnRefundPolicyPage() {
  const page = await getPageBySlug('return-refund-policy')

  const headerImg =
    (typeof page?.headerImage === 'object' && page?.headerImage?.url) ||
    page?.headerImageUrl ||
    '/images/lovixa-hero-banner-products.jpg'

  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[{ label: 'Return & Replacement Policy' }]}
          badge={page?.badge || 'PEACE OF MIND COMMITMENT'}
          title={page?.title || 'Peace of Mind,'}
          highlightTitle={page?.highlightTitle || 'Return & Transit Replacement Policy'}
          subtitle={
            page?.subtitle ||
            'Understand our hygiene standards, transit damage replacement guarantee, and replacement procedure.'
          }
          imageSrc={headerImg}
          imageAlt={page?.title || 'LOVIXA Return and Replacement Policy'}
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
                  1. Hygiene &amp; Cosmetic Safety Guidelines
                </h2>
                <p>
                  Due to the personal nature and strict hygiene standards applicable to cosmetic and hair care products, opened or unsealed items cannot be returned or restocked once used.
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
