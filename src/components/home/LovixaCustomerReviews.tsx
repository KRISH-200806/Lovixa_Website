'use client'

import { Star, CheckCircle2, Sparkles } from 'lucide-react'

const REVIEWS = [
  {
    author: 'Priya S.',
    location: 'Ahmedabad',
    rating: 5,
    product: 'Hair Oil & Shampoo Duo',
    quote:
      'The oil ritual is so calming and non-greasy. The shampoo cleanses without that dry, stripped straw sensation. My hair feels noticeably softer and healthier after 2 weeks!',
  },
  {
    author: 'Ananya R.',
    location: 'Mumbai',
    rating: 5,
    product: 'LOVIXA Shampoo',
    quote:
      'Finding a daily shampoo that doesn’t irritate my sensitive scalp was so hard. LOVIXA makes my hair feel so light, bouncy, and completely clean with just one wash.',
  },
  {
    author: 'Devangi P.',
    location: 'Surat',
    rating: 5,
    product: 'LOVIXA Hair Oil',
    quote:
      'The texture of this hair oil is wonderful. It washes out effortlessly with the shampoo and gives my ends such a natural, glossy softness without any stickiness.',
  },
]

export function LovixaCustomerReviews() {
  return (
    <section id="reviews" className="py-10 sm:py-14 bg-[#FAF6F8]/60 border-b border-[#F0DCE5] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Section Header */}
        <div className="text-center max-w-xl mx-auto mb-7 sm:mb-9 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8C4D4] text-[#6B2D5C] text-[10px] sm:text-xs font-bold tracking-widest uppercase font-sans shadow-xs">
            <Sparkles className="w-3 h-3 text-[#6B2D5C]" />
            <span>REAL RESULTS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-sans font-black text-[#2B1822] tracking-tight uppercase">
            Customer Reviews
          </h2>

          {/* Social Proof Pill Bar */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#2B1822] font-sans">4.9 / 5.0</span>
            <span className="text-[11px] text-[#2B1822]/60 font-sans">(420+ Verified Reviews)</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {REVIEWS.map((review) => (
            <div
              key={review.author}
              className="bg-white rounded-2xl border border-[#F0DCE5] p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-[13px] text-[#2B1822]/80 leading-relaxed italic mb-4 font-sans">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0DCE5]/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2B1822] font-sans">
                    {review.author}
                  </h4>
                  <p className="text-[10px] text-[#2B1822]/50 font-sans">
                    {review.location} • <span className="text-[#6B2D5C] font-semibold">{review.product}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
