'use client'

export interface Variant {
  id: string
  sku: string
  title: string
  price: number
  compareAtPrice?: number
  inventory: number
  options?: Array<{ name: string; value: string }>
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: {
  variants: Variant[]
  selectedVariant?: Variant
  onSelectVariant: (variant: Variant) => void
}) {
  if (!variants || variants.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#2B1822]">
          Select Option / Variant
        </label>
        {selectedVariant && (
          <span className="text-xs font-semibold text-stone-500">
            {selectedVariant.inventory > 0 ? (
              <span className="text-[#6B2D5C] font-bold">In Stock ({selectedVariant.inventory} available)</span>
            ) : (
              <span className="text-stone-400">Out of Stock</span>
            )}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {variants.map((v) => {
          const isSelected = selectedVariant?.id === v.id
          const isOutOfStock = v.inventory <= 0

          return (
            <button
              key={v.id}
              onClick={() => onSelectVariant(v)}
              disabled={isOutOfStock}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#6B2D5C] bg-[#6B2D5C] text-white shadow-sm'
                  : isOutOfStock
                  ? 'border-stone-200 bg-stone-50 text-stone-300 cursor-not-allowed line-through'
                  : 'border-[#E8C4D4]/70 bg-white text-[#2B1822] hover:border-[#6B2D5C]/60 hover:bg-[#E8C4D4]/20'
              }`}
            >
              <div className="text-xs font-bold truncate">{v.title}</div>
              <div className={`text-xs mt-1 ${isSelected ? 'text-white/90' : 'text-stone-500'}`}>
                ${v.price.toFixed(2)}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
