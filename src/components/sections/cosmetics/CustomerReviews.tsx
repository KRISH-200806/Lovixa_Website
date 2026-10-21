import React from 'react'

const REVIEWS = [
  {
    name: 'Pooja Sharma',
    city: 'Mumbai',
    product: 'Velvet Luxe Matte Lipstick (Ruby Romance)',
    rating: 5,
    comment: 'The pigmentation is unbelievable! It stayed fresh through my entire 8-hour workday without drying my lips out. Truly luxury quality at an affordable price.',
    date: '2 days ago',
  },
  {
    name: 'Ananya Roy',
    city: 'Bangalore',
    product: 'Glow Radiance 10% Niacinamide Serum',
    rating: 5,
    comment: 'Within two weeks, my acne spots faded visibly and my skin has this radiant dewy bounce. The light watery texture sinks in immediately!',
    date: '1 week ago',
  },
  {
    name: 'Sneha Patel',
    city: 'Ahmedabad',
    product: 'Invisible Shield SPF 50+ Sunscreen',
    rating: 5,
    comment: 'Finally a sunscreen that leaves ZERO white cast! Works beautifully under makeup without piling or greasy feel. My holy grail SPF now.',
    date: '3 days ago',
  },
]

export default function CustomerReviews() {
  return (
    <section className="py-20 bg-brand-50/40 border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-radius-pill bg-brand-50 border border-brand-200 text-brand-500 text-body-xs font-semibold mb-2">
            <span>★ ★ ★ ★ ★</span>
            <span>4.9 / 5 Average Rating</span>
          </div>
          <span className="font-accent italic text-brand-600 text-body-lg font-normal block">
            Real Customer Stories
          </span>
          <h2 className="font-heading text-h2 uppercase tracking-wide text-foreground">
            Loved By 10,000+ Beauty Lovers
          </h2>
          <p className="text-neutral-500 text-body-md font-sans">
            Real feedback from verified customers who transformed their daily skincare and makeup rituals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.name}
              className="p-6 rounded-radius-lg bg-background border border-brand-200 flex flex-col justify-between shadow-elev-1 hover:border-brand-500 transition-colors"
            >
              <div>
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-brand-500 text-sm">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-semantic-success flex items-center gap-1">
                    <span>✓</span> Verified Buyer
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-body-sm text-foreground font-sans italic leading-relaxed mb-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-4 border-t border-brand-200">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-body-sm font-semibold text-foreground">
                    {rev.name}
                  </span>
                  <span className="text-[11px] text-neutral-400">{rev.city}</span>
                </div>
                <p className="text-[11px] text-brand-500 font-medium mt-0.5 truncate">
                  Bought: {rev.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
