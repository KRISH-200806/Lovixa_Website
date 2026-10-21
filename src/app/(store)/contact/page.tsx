import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/cms/pages'
import { ContactFormClient } from '@/components/forms/ContactFormClient'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('contact')
  return {
    title: page?.seo?.metaTitle || page?.title || 'Contact Us — LOVIXA COSMETIC Concierge & Customer Care',
    description:
      page?.seo?.metaDescription ||
      page?.subtitle ||
      'Connect with LOVIXA COSMETIC. Speak to our hair care specialists, track orders, or request personalized routine assistance.',
  }
}

export default async function ContactPage() {
  const page = await getPageBySlug('contact')
  return <ContactFormClient page={page} />
}
