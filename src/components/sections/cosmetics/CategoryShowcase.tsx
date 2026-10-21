import React from 'react'
import { COSMETIC_CATEGORIES } from '@/data/mockCosmetics'

export default function CategoryShowcase() {
  return (
    <section id="categories" className="py-16 bg-background border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-1">
          <span className="font-accent italic text-brand-600 text-body-lg font-normal block">
            Curated Beauty Collections
          </span>
          <h2 className="font-heading text-h2 uppercase tracking-wide text-foreground">
            Shop By Collection
          </h2>
          <p className="text-neutral-500 text-body-md font-sans">
            From velvet lips to glass-skin serums, find targeted skincare and high-pigment cosmetics.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {COSMETIC_CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#category-${cat.slug}`}
              className="group relative rounded-radius-lg overflow-hidden bg-brand-50 border border-brand-200 hover:border-brand-500 transition-all duration-300 flex flex-col items-center text-center p-3 sm:p-4 hover:shadow-elev-2 hover:-translate-y-1"
            >
              {/* Circular / Rounded Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-brand-100 mb-3 border-2 border-brand-200 group-hover:border-brand-500 transition-colors">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Name and Count */}
              <h3 className="font-heading text-body-sm font-semibold text-foreground group-hover:text-brand-500 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-neutral-500 mt-0.5">
                {cat.itemCount} Products
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
