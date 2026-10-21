import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let globalCurrencySymbol =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CURRENCY_SYMBOL) || '₹'
let globalCurrencyCode =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEFAULT_CURRENCY) || 'INR'
let globalExchangeRate = 1

export function setGlobalCurrency(symbol: string, code?: string, exchangeRate?: number) {
  if (symbol) globalCurrencySymbol = symbol
  if (code) globalCurrencyCode = code
  if (typeof exchangeRate === 'number' && exchangeRate > 0) {
    globalExchangeRate = exchangeRate
  }
}

export function getGlobalCurrency() {
  return {
    symbol: globalCurrencySymbol,
    code: globalCurrencyCode,
    exchangeRate: globalExchangeRate,
  }
}

export function convertPrice(amount: number, rate?: number): number {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0
  const activeRate = typeof rate === 'number' && rate > 0 ? rate : globalExchangeRate
  return num * activeRate
}

export function formatPrice(
  amount: number,
  currency?: string,
  symbol?: string,
  exchangeRate?: number
): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0
  const activeRate = typeof exchangeRate === 'number' && exchangeRate > 0 ? exchangeRate : globalExchangeRate
  const convertedAmount = num * activeRate
  const activeSymbol = symbol || globalCurrencySymbol || '₹'

  return `${activeSymbol}${convertedAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatCurrency(
  amount: number,
  currencyCode?: string,
  customSymbol?: string
): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0
  const symbolMap: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'AU$',
    JPY: '¥',
  }
  const code = (currencyCode || globalCurrencyCode || 'INR').toUpperCase()
  const symbol = customSymbol || symbolMap[code] || globalCurrencySymbol || '₹'

  return `${symbol}${num.toLocaleString('en-IN', {
    minimumFractionDigits: num % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}
