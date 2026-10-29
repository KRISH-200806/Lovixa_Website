'use client'

import { Truck, CheckCircle2 } from 'lucide-react'
import { useCurrency, useStoreSettings } from '@/components/providers/StoreSettingsProvider'
import { useCartStore } from '@/lib/cart/cart-store'

export function FreeShippingBar({
  currentAmount,
  subtotal,
  threshold,
}: {
  currentAmount?: number
  subtotal?: number
  threshold?: number
}) {
  const { formatPrice } = useCurrency()
  const settings = useStoreSettings()
  const shippingConfig = useCartStore((state) => state.shippingConfig)
  const cartSubtotal = useCartStore((state) => state.getSubtotal())

  const activeAmount =
    typeof subtotal === 'number' && !isNaN(subtotal)
      ? subtotal
      : typeof currentAmount === 'number' && !isNaN(currentAmount)
        ? currentAmount
        : cartSubtotal

  const numAmount = typeof activeAmount === 'number' && !isNaN(activeAmount) ? Math.max(0, activeAmount) : 0

  const rawThreshold =
    typeof threshold === 'number' && !isNaN(threshold)
      ? threshold
      : typeof settings?.shipping?.freeShippingThreshold === 'number' && !isNaN(settings.shipping.freeShippingThreshold)
        ? settings.shipping.freeShippingThreshold
        : typeof shippingConfig?.freeShippingThreshold === 'number' && !isNaN(shippingConfig.freeShippingThreshold)
          ? shippingConfig.freeShippingThreshold
          : (typeof process !== 'undefined' && Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD)) || 999

  const effectiveThreshold = Math.max(1, rawThreshold)

  const isEnabled =
    settings?.shipping?.freeShippingEnabled !== undefined
      ? Boolean(settings.shipping.freeShippingEnabled)
      : Boolean(shippingConfig?.freeShippingEnabled)

  if (!isEnabled) return null

  const percentage = Math.min(Math.round((numAmount / effectiveThreshold) * 100), 100)
  const remaining = Math.max(0, effectiveThreshold - numAmount)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        {percentage >= 100 ? (
          <span className="font-semibold text-[#6B2D5C] flex items-center gap-1.5 font-sans">
            <CheckCircle2 className="w-4 h-4 text-[#6B2D5C]" />
            You&apos;ve unlocked FREE Pan-India Shipping!
          </span>
        ) : (
          <span className="font-medium text-[#2B1822] flex items-center gap-1.5 font-sans">
            <Truck className="w-3.5 h-3.5 text-[#6B2D5C]" />
            Add <strong className="text-[#6B2D5C]">{formatPrice(remaining)}</strong> more for FREE shipping
          </span>
        )}
        <span className="font-bold text-[#2B1822]/60 font-sans">{percentage}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 bg-[#E8C4D4]/40 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 rounded-full bg-[#6B2D5C]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
