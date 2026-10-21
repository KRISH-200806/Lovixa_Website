'use client'

import { useCurrency } from '@/components/providers/StoreSettingsProvider'

export function Price({
  amount,
  className = '',
  overrideSymbol,
}: {
  amount: number
  className?: string
  overrideSymbol?: string
}) {
  const { formatPrice } = useCurrency()
  return <span className={className}>{formatPrice(amount, overrideSymbol)}</span>
}
