import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Heart, ShieldCheck, Leaf } from 'lucide-react'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'

export const metadata = {
  title: 'Our Story & Philosophy — LOVIXA COSMETIC',
  description:
    'Discover LOVIXA COSMETIC — thoughtful, nature-inspired formulations crafted for gentle hair and skin care.',
}

export default function AboutPage() {
  const brandPillars = [
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
          badge="OUR PHILOSOPHY"
          title="Beauty Inspired by Nature."
          highlightTitle="Thoughtfully Yours."
          subtitle="At LOVIXA COSMETIC, we believe daily care should be simple, honest, and grounded in pure botanical nourishment."
          imageSrc="/images/lovixa-story.jpg"
          imageAlt="LOVIXA Cosmetic Botanical Story"
          priority
        />
      </div>

      {/* Editorial Introduction Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#6B2D5C] font-medium font-sans">
            OUR PURPOSE
          </span>
          <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-[#2B1822] tracking-tight leading-tight max-w-3xl mx-auto">
            Care that feels thoughtful, gentle, and authentically personal.
          </h2>
          <div className="w-16 h-px bg-[#6B2D5C] mx-auto" />
          <p className="text-base sm:text-lg text-[#2B1822]/75 leading-relaxed max-w-2xl mx-auto font-sans">
            LOVIXA COSMETIC was created to offer an unhurried, gentle approach to modern personal care. We bring together natural plant extracts and proven cosmetic ingredients to create products that enhance your everyday routine without empty promises or overwhelming complexity.
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
                src="/images/about-follower.webp"
                alt="LOVIXA Lifestyle & Self-Care"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {/* Right Story Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#6B2D5C] font-sans">
                THE LOVIXA DIFFERENCE
              </span>
              <h3 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl text-[#2B1822] tracking-tight leading-snug">
                Formulated for real hair and skin, designed for everyday confidence.
              </h3>
              <p className="text-sm sm:text-base text-[#2B1822]/75 leading-relaxed font-sans">
                We believe your beauty routine shouldn&apos;t feel complicated. Whether it is our rosemary-infused botanical shampoo, cold-pressed hair oil, or gentle daily skin essentials, each LOVIXA formula is created to wash cleanly, moisturize deeply, and feel wonderful on your body.
              </p>
              <p className="text-sm sm:text-base text-[#2B1822]/75 leading-relaxed font-sans">
                We focus on what matters most: gentle cleansing agents, nourishing plant oils, balanced pH levels, and clear usage guidance so you can care for yourself with complete peace of mind.
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
