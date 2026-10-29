import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/cms/pages'
import { FAQClient, DEFAULT_FAQS } from '@/components/faq/FAQClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('faq')
  const title = page?.seo?.metaTitle || page?.title || 'Frequently Asked Questions — LOVIXA COSMETIC'
  const description =
    page?.seo?.metaDescription ||
    page?.subtitle ||
    'Answers to your questions regarding LOVIXA Botanical Hair Care formulations, order tracking, WhatsApp checkout, and delivery.'

  return {
    title,
    description,
    alternates: {
      canonical: 'https://www.lovixacosmetic.com/faq',
    },
    openGraph: {
      title,
      description,
      url: 'https://www.lovixacosmetic.com/faq',
    },
  }
}

export default async function FAQPage() {
  const page = await getPageBySlug('faq')

  const faqItems =
    page?.faqItems && page.faqItems.length > 0 ? page.faqItems : DEFAULT_FAQS

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQClient page={page} />
    </>
  )
}
