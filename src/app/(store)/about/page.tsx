import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Sparkles, Heart, ShieldCheck, Leaf } from 'lucide-react'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import { getPageBySlug } from '@/lib/cms/pages'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about')
  return {
    title: page?.seo?.metaTitle || page?.title || 'Our Story & Philosophy — LOVIXA COSMETIC',
    description:
      page?.seo?.metaDescription ||
      page?.subtitle ||
      'Discover LOVIXA COSMETIC — thoughtful, nature-inspired formulations crafted for gentle hair and skin care.',
  }
}

const ICON_MAP = {
  leaf: Leaf,
  shield: ShieldCheck,
  sparkles: Sparkles,
  heart: Heart,
}

export default async function AboutPage() {
  const page = await getPageBySlug('about')

  // Resolve Header Image
  const headerImg =
    (typeof page?.headerImage === 'object' && page?.headerImage?.url) ||
    page?.headerImageUrl ||
    '/images/lovixa-story.jpg'

  // Resolve Story Image
  const storyImg =
    (typeof page?.aboutStory?.storyImage === 'object' && page?.aboutStory?.storyImage?.url) ||
    page?.aboutStory?.storyImageUrl ||
    '/images/about-follower.webp'

  // Brand Pillars from CMS or default
  const brandPillars =
    page?.aboutStory?.brandPillars && page.aboutStory.brandPillars.length > 0
      ? page.aboutStory.brandPillars.map((p) => ({
          icon: (p.iconType && ICON_MAP[p.iconType]) || Leaf,
          title: p.title,
          desc: p.desc,
        }))
      : [
          {
            icon: Leaf,
            title: 'Botanical Simplicity',
            desc: 'Selected plant extracts, nourishing oils, and gentle surfactants designed to care for hair and skin naturally.',
          },
          {
            icon: ShieldCheck,
            title: 'Formulation Transparency',
            desc: 'Clear ingredient profiles, pH-conscious balances, and formulas free from harsh sulfates and parabens.',
          },
          {
            icon: Sparkles,
            title: 'Mindful Daily Rituals',
            desc: 'Beauty care that transforms everyday washing and moisturizing into peaceful, restoring self-care moments.',
          },
          {
            icon: Heart,
            title: 'Dedicated Customer Care',
            desc: 'Authentic support, transparent shipping policies, and a commitment to your genuine satisfaction.',
          },
        ]

  return (
    <div className="bg-[#FBF6F8] min-h-screen text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeaderBanner
          breadcrumbs={[{ label: 'Our Story' }]}
          badge={page?.badge || 'OUR PHILOSOPHY'}
          title={page?.title || 'Beauty Inspired by Nature.'}
          highlightTitle={page?.highlightTitle || 'Thoughtfully Yours.'}
          subtitle={
            page?.subtitle ||
            'At LOVIXA COSMETIC, we believe daily care should be simple, honest, and grounded in pure botanical nourishment.'
          }
          imageSrc={headerImg}
          imageAlt={page?.title || 'LOVIXA Cosmetic Botanical Story'}
          priority
        />
      </div>

      {/* Editorial Introduction Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#6B2D5C] font-medium font-sans">
            {page?.aboutStory?.editorialPurposeBadge || 'OUR PURPOSE'}
          </span>
          <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#2B1822] tracking-tight leading-tight max-w-3xl mx-auto">
            {page?.aboutStory?.editorialHeading ||
              'Care that feels thoughtful, gentle, and authentically personal.'}
          </h2>
          <div className="w-16 h-px bg-[#6B2D5C] mx-auto" />
          <p className="text-base sm:text-lg text-[#2B1822]/75 leading-relaxed max-w-2xl mx-auto font-sans">
            {page?.aboutStory?.editorialText ||
              'LOVIXA COSMETIC was created to offer an unhurried, gentle approach to modern personal care. We bring together natural plant extracts and proven cosmetic ingredients to create products that enhance your everyday routine without empty promises or overwhelming complexity.'}
          </p>
        </div>
      </section>

      {/* Editorial Split Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="bg-[#E8C4D4]/20 rounded-3xl p-8 sm:p-14 lg:p-16 border border-[#E8C4D4]/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Imagery */}
            <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-[#E8C4D4]/40">
              <Image
                src={storyImg}
                alt="LOVIXA Lifestyle & Self-Care"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {/* Right Story Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6B2D5C] font-sans">
                {page?.aboutStory?.storyBadge || 'THE LOVIXA DIFFERENCE'}
              </span>
              <h3 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-[#2B1822] tracking-tight leading-snug">
                {page?.aboutStory?.storyHeading ||
                  'Formulated for real hair and skin, designed for everyday confidence.'}
              </h3>
              <p className="text-sm sm:text-base text-[#2B1822]/75 leading-relaxed font-sans">
                {page?.aboutStory?.storyParagraph1 ||
                  "We believe your beauty routine shouldn't feel complicated. Whether it is our rosemary-infused botanical shampoo, cold-pressed hair oil, or gentle daily skin essentials, each LOVIXA formula is created to wash cleanly, moisturize deeply, and feel wonderful on your body."}
              </p>
              <p className="text-sm sm:text-base text-[#2B1822]/75 leading-relaxed font-sans">
                {page?.aboutStory?.storyParagraph2 ||
                  'We focus on what matters most: gentle cleansing agents, nourishing plant oils, balanced pH levels, and clear usage guidance so you can care for yourself with complete peace of mind.'}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  prefetch={true}
                  scroll={true}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm font-sans"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  prefetch={true}
                  scroll={true}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-[#FBF6F8] text-[#2B1822] border border-[#E8C4D4]/60 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors font-sans"
                >
                  <span>Get in Touch</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Pillars Grid */}
      <section className="bg-white border-y border-[#E8C4D4]/40 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6B2D5C] font-sans">
              OUR COMMITMENTS
            </span>
            <h2 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-[#2B1822] tracking-tight">
              What Guides Every Formula
            </h2>
            <p className="text-xs sm:text-sm text-[#2B1822]/70 font-sans">
              Honest beauty care based on transparency, botanical integrity, and respectful customer relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandPillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-7 flex flex-col space-y-4 hover:border-[#6B2D5C]/40 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FBF6F8] border border-[#E8C4D4]/50 flex items-center justify-center text-[#6B2D5C] shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#2B1822]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2B1822]/70 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* WYSIWYG Content if populated */}
      {page?.content && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-[#E8C4D4]/60 p-8 sm:p-12 shadow-xs prose prose-stone max-w-none font-sans">
            <RichText data={page.content} />
          </div>
        </section>
      )}

      {/* Editorial Full Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="relative w-full aspect-[2.4/1] sm:aspect-[3.2/1] rounded-3xl overflow-hidden shadow-sm border border-[#E8C4D4]/50">
          <Image
            src="/images/about-all-products.webp"
            alt="LOVIXA Botanical Formulations Showcase"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
      </section>

      {/* Concierge & Support CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 text-center">
        <div className="bg-[#E8C4D4]/25 border border-[#E8C4D4]/60 rounded-3xl p-10 sm:p-14 space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#6B2D5C] font-bold font-sans">
            HERE FOR YOU
          </span>
          <h2 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-[#2B1822] tracking-tight">
            Have a Question About Our Formulations?
          </h2>
          <p className="text-xs sm:text-sm text-[#2B1822]/70 max-w-xl mx-auto font-sans leading-relaxed">
            Our customer concierge team is available to assist you with product details, order inquiries, and care recommendations.
          </p>
          <div>
            <Link
              href="/contact"
              prefetch={true}
              scroll={true}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm font-sans"
            >
              <span>Contact Concierge</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
