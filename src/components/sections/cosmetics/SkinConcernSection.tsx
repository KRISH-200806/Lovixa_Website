import React from 'react'

const CONCERNS = [
  {
    title: 'Hair Fall & Scalp Weakness',
    heroActive: 'Rosemary & Methi Dana Actives',
    description: 'Reduce hair breakage and deeply nourish scalp roots for stronger, thicker hair.',
    tag: 'Hair Therapy',
    image: '/images/hero-banner.png',
  },
  {
    title: 'Dark Spots & Pigmentation',
    heroActive: '10% Niacinamide + Zinc',
    description: 'Brighten uneven tone and fade post-acne blemishes.',
    tag: 'Glow Ritual',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Dry & Chapped Lips',
    heroActive: 'Rosehip Oil + Tripeptide',
    description: 'Deeply hydrate, condition and plump lips with high-shine gloss.',
    tag: 'Lip Repair',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Sun Damage & Blue Light',
    heroActive: 'Broad Spectrum SPF 50+',
    description: 'Invisible zero-white cast shield against UV and digital screen stress.',
    tag: 'Daily Defense',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  },
]

export default function SkinConcernSection() {
  return (
    <section className="py-20 bg-background border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-1">
          <span className="font-accent italic text-brand-600 text-body-lg font-normal block">
            Targeted Beauty Solutions
          </span>
          <h2 className="font-heading text-h2 uppercase tracking-wide text-foreground">
            Shop By Skin Concern
          </h2>
          <p className="text-neutral-500 text-body-md font-sans">
            Personalize your beauty regimen based on what your skin needs right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONCERNS.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-radius-lg overflow-hidden bg-brand-50 border border-brand-200 flex flex-col justify-between hover:border-brand-500 transition-all duration-300 shadow-elev-1 hover:shadow-elev-3"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-brand-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-background/90 backdrop-blur-md text-brand-500 border border-brand-200 rounded-radius-pill">
                  {item.tag}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-body-md font-semibold text-foreground group-hover:text-brand-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-brand-500 text-[11px] font-semibold mt-0.5">
                    Hero: {item.heroActive}
                  </p>
                  <p className="text-neutral-500 text-body-xs mt-2 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <a
                  href="#shop-products"
                  className="inline-flex items-center gap-1.5 text-body-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors pt-4 mt-2 border-t border-brand-200"
                >
                  <span>Explore Routine</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
