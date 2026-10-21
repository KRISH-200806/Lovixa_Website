/**
 * LOVIXA COSMETIC — WhatsApp Order Management Utilities
 *
 * Implements:
 * 1. Formatted WhatsApp Click-to-Chat message generation
 * 2. URL encoding & Click-to-Chat deep link construction (wa.me)
 * 3. Indian Mobile Number & Pincode validation rules
 * 4. List of Indian States & Union Territories
 */

export interface WhatsAppProductItem {
  title: string
  optionsSummary?: string
  variantTitle?: string
  quantity: number
  price: number
}

export interface WhatsAppOrderDetails {
  orderNumber: string
  customerName: string
  customerMobile: string
  customerEmail?: string
  items: WhatsAppProductItem[]
  subtotal: number
  shippingTotal: number
  discountTotal?: number
  couponCode?: string
  grandTotal: number
  currencySymbol?: string
  shippingAddress: {
    house: string
    street: string
    landmark?: string
    city: string
    state: string
    pincode: string
    country?: string
  }
}

/**
 * Standard list of Indian States & Union Territories for clean checkout address selection
 */
export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]

/**
 * Validates Indian Mobile Number
 * Accepts formats: 9409876865, +91 9409876865, +919712460509, 09409876865
 * Must be 10 digits starting with 6, 7, 8, or 9
 */
export function validateIndianMobile(raw: string): { valid: boolean; normalized: string; error?: string } {
  if (!raw || !raw.trim()) {
    return { valid: false, normalized: '', error: 'Mobile number is required' }
  }

  // Strip spaces, dashes, parentheses
  let cleaned = raw.replace(/[\s\-\(\)]/g, '')

  // Remove leading +91, 91 (if 12 digits), or 0 (if 11 digits)
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3)
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2)
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1)
  }

  const isValid = /^[6-9]\d{9}$/.test(cleaned)

  if (!isValid) {
    return {
      valid: false,
      normalized: cleaned,
      error: 'Please enter a valid 10-digit Indian mobile number (e.g. 94098 76865)',
    }
  }

  return { valid: true, normalized: cleaned }
}

/**
 * Validates Indian 6-digit Pincode
 * First digit must be 1-9
 */
export function validateIndianPincode(
  pincode: string,
  serviceablePincodes?: string
): { valid: boolean; error?: string } {
  const trimmed = (pincode || '').trim()

  if (!trimmed) {
    return { valid: false, error: 'Pincode is required' }
  }

  if (!/^[1-9][0-9]{5}$/.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid 6-digit Indian pincode' }
  }

  if (serviceablePincodes && serviceablePincodes.trim()) {
    const list = serviceablePincodes
      .split(/[\s,;]+/)
      .map((p) => p.trim())
      .filter(Boolean)
    if (list.length > 0 && !list.includes(trimmed)) {
      return {
        valid: false,
        error: `Delivery is currently not available for pincode ${trimmed}. Please contact us on WhatsApp for assistance.`,
      }
    }
  }

  return { valid: true }
}

/**
 * Formats a clean currency amount (e.g. ₹299 or ₹299.50)
 */
function formatCurrency(amount: number, symbol = '₹'): string {
  const rounded = Math.round(amount * 100) / 100
  const isWhole = Number.isInteger(rounded)
  const formattedNumber = isWhole
    ? rounded.toLocaleString('en-IN')
    : rounded.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${symbol}${formattedNumber}`
}

/**
 * Generates the official LOVIXA WhatsApp Order Request message
 */
export function generateWhatsAppOrderMessage(order: WhatsAppOrderDetails): string {
  const sym = order.currencySymbol || '₹'

  // Build numbered products list
  const productBlocks = order.items.map((item, idx) => {
    const unitPrice = formatCurrency(item.price, sym)
    const lineTotal = formatCurrency(item.price * item.quantity, sym)
    const variantLine = (item.optionsSummary || item.variantTitle)
      ? `Variant: ${item.optionsSummary || item.variantTitle}\n`
      : ''

    return `${idx + 1}. ${item.title}\n${variantLine}Quantity: ${item.quantity}\nPrice: ${unitPrice} each\nTotal: ${lineTotal}`
  })

  const discountBlock = order.discountTotal && order.discountTotal > 0
    ? `\nDiscount (${order.couponCode || 'Promo'}): -${formatCurrency(order.discountTotal, sym)}`
    : ''

  const shippingDisplay = order.shippingTotal === 0 ? 'FREE' : formatCurrency(order.shippingTotal, sym)

  const landmarkLine = order.shippingAddress.landmark
    ? `Landmark: ${order.shippingAddress.landmark}\n`
    : ''

  const emailLine = order.customerEmail && order.customerEmail.trim()
    ? `Email: ${order.customerEmail.trim()}\n`
    : ''

  return `*LOVIXA COSMETIC — NEW ORDER REQUEST*

Order Reference: ${order.orderNumber}

Customer Details:
Name: ${order.customerName}
Mobile: ${order.customerMobile}
${emailLine}
Products:
${productBlocks.join('\n\n')}

Subtotal: ${formatCurrency(order.subtotal, sym)}${discountBlock}
Shipping: ${shippingDisplay}
Grand Total: ${formatCurrency(order.grandTotal, sym)}

Delivery Address:
House / Building: ${order.shippingAddress.house}
Area: ${order.shippingAddress.street}
${landmarkLine}City: ${order.shippingAddress.city}
State: ${order.shippingAddress.state}
Pincode: ${order.shippingAddress.pincode}
Country: ${order.shippingAddress.country || 'India'}

Payment Method: Manual UPI / Bank Transfer
Payment Status: Awaiting Payment

Order Status: Awaiting Confirmation

Please confirm product availability, shipping charges, and payment instructions.

Thank you for choosing LOVIXA COSMETIC.`
}

/**
 * Constructs the WhatsApp Click-to-Chat URL
 * Format: https://wa.me/BUSINESS_NUMBER?text=ENCODED_MESSAGE
 * - Number in international format without + or spaces
 * - Message encoded using encodeURIComponent
 */
export function buildWhatsAppClickToChatUrl(
  businessNumber: string,
  message: string
): string {
  // Normalize business number: remove any non-digit characters (+, spaces, dashes)
  let cleanNumber = (businessNumber || '919712460509').replace(/[^0-9]/g, '')

  // If provided as 10 digits Indian number, prefix with 91
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`
  }

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${cleanNumber}?text=${encoded}`
}
