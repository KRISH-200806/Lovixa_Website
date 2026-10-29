import type { Metadata } from 'next'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { PolicyNavigation } from '@/components/common/PolicyNavigation'
import { getPageBySlug } from '@/lib/cms/pages'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('shipping-policy')
  return {
    title: page?.seo?.metaTitle || page?.title || 'Shipping Policy — LOVIXA COSMETIC',
    description:
      page?.seo?.metaDescription ||
      page?.subtitle ||
      'Detailed shipping guidelines, dispatch timeframes, and pan-India delivery details for LOVIXA orders.',
  }
}

export default async function ShippingPolicyPage() {
  const page = await getPageBySlug('shipping-policy')

  const headerImg =
    (typeof page?.headerImage === 'object' && page?.headerImage?.url) ||
    page?.headerImageUrl ||
    '/images/lovixa-hero-banner-products.jpg'

  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[{ label: 'Shipping Policy' }]}
          badge={page?.badge || 'DELIVERY & DISPATCH'}
          title={page?.title || 'Prompt Pan-India Delivery,'}
          highlightTitle={page?.highlightTitle || 'Dispatched Fast With Care'}
          subtitle={
            page?.subtitle ||
            'Explore dispatch schedules, delivery timelines across India, tracking, and trusted courier partners.'
          }
          imageSrc={headerImg}
          imageAlt={page?.title || 'LOVIXA Shipping Policy'}
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
          <div className="space-y-8 text-sm sm:text-base text-[#2B1822]/85 leading-relaxed font-sans">
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
                  1. Processing &amp; Dispatch Timeframe
                </h2>
                <p>
                  Every LOVIXA order is inspected and hand-packed with protective cushioning to ensure your amber bottles arrive in pristine condition.
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
