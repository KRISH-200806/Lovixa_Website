import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { formatPrice, convertPrice, setGlobalCurrency } from '../src/lib/utils'

describe('Currency & Price Formatting Engine', () => {
  it('formats basic USD prices correctly', () => {
    setGlobalCurrency('$', 'USD', 1)
    const formatted = formatPrice(49.99)
    assert.equal(formatted, '$49.99')
  })

  it('formats zero and negative price gracefully', () => {
    setGlobalCurrency('$', 'USD', 1)
    assert.equal(formatPrice(0), '$0.00')
    assert.equal(formatPrice(NaN), '$0.00')
  })

  it('handles dynamic exchange rate conversions', () => {
    // 1 USD = 86.5 INR
    const inrPrice = convertPrice(100, 86.5)
    assert.equal(inrPrice, 8650)

    const formattedInr = formatPrice(100, 'INR', '₹', 86.5)
    assert.equal(formattedInr, '₹8,650.00')
  })

  it('supports Euro and British Pound conversions', () => {
    // 1 USD = 0.92 EUR
    const eurPrice = formatPrice(50, 'EUR', '€', 0.92)
    assert.equal(eurPrice, '€46.00')

    // 1 USD = 0.79 GBP
    const gbpPrice = formatPrice(100, 'GBP', '£', 0.79)
    assert.equal(gbpPrice, '£79.00')
  })
})
