import React from 'react'

const USPs = [
  {
    icon: '🌿',
    title: '100% Vegan & Cruelty-Free',
    description: 'Never tested on animals. Formulated with ethical botanical extracts and mineral pigments.',
  },
  {
    icon: '🔬',
    title: 'Clean & Clinically Tested',
    description: 'Zero parabens, SLS, or synthetic fragrance. Safe for sensitive and acne-prone skin.',
  },
  {
    icon: '💧',
    title: 'Skin-Nourishing Actives',
    description: 'Enriched with Niacinamide, Hyaluronic Acid, Vitamin E & Jojoba Oil in every formula.',
  },
  {
    icon: '🚚',
    title: 'Express Shipping & Returns',
    description: 'Fast, secure Pan-India delivery with trusted courier partners and hassle-free 7-day returns.',
  },
]

export default function BeautyUSPs() {
  return (
    <section className="py-16 bg-brand-50/50 border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {USPs.map((usp) => (
            <div
              key={usp.title}
              className="p-6 rounded-radius-lg bg-background border border-brand-200 flex flex-col items-start hover:border-brand-500 transition-colors shadow-elev-1"
            >
              <span className="text-3xl mb-4 p-3 rounded-radius-md bg-brand-100 inline-block">
                {usp.icon}
              </span>
              <h3 className="font-heading text-body-md font-semibold text-foreground mb-2">
                {usp.title}
              </h3>
              <p className="text-body-xs text-neutral-500 font-sans leading-relaxed">
                {usp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
