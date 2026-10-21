export interface VerifyPurchaseParams {
  productId: string
  customerEmail: string
  customerId?: string
}

export interface PurchaseVerificationResult {
  purchased: boolean
  reason?: string
}

/**
 * Validates whether a customer (identified by email or customerId) has actually purchased the specified product.
 * Requires at least one non-cancelled, non-failed order containing the matching productId.
 */
export async function hasCustomerPurchasedProduct(
  payload: any,
  params: VerifyPurchaseParams
): Promise<PurchaseVerificationResult> {
  const { productId, customerEmail, customerId } = params

  if (!customerEmail && !customerId) {
    return {
      purchased: false,
      reason: 'Customer account or email is required for verification.',
    }
  }

  const normalizedEmail = (customerEmail || '').trim().toLowerCase()
  const targetProductId = String(productId).trim()

  try {
    const orConditions: any[] = []
    if (normalizedEmail) {
      orConditions.push({ customerEmail: { equals: normalizedEmail } })
    }
    if (customerId) {
      orConditions.push({ customer: { equals: customerId } })
    }

    const orders = await payload.find({
      collection: 'orders',
      where: {
        or: orConditions,
      },
      limit: 100,
    })

    if (!orders || !orders.docs || orders.docs.length === 0) {
      return {
        purchased: false,
        reason: `No orders found associated with email "${customerEmail}". Please use the email address you used during checkout.`,
      }
    }

    const hasPurchased = orders.docs.some((order: any) => {
      // Exclude cancelled or failed orders
      if (order.paymentStatus === 'failed' || order.fulfillmentStatus === 'cancelled') {
        return false
      }

      if (!Array.isArray(order.items)) return false

      return order.items.some((item: any) => {
        if (!item) return false
        const itemPid = String(item.productId || (item.product && (item.product.id || item.product)) || '').trim()
        return itemPid === targetProductId
      })
    })

    if (!hasPurchased) {
      return {
        purchased: false,
        reason: 'Order history found for this email, but no completed purchase contains this specific product.',
      }
    }

    return { purchased: true }
  } catch (err: any) {
    console.error('Error during purchase verification:', err)
    return {
      purchased: false,
      reason: 'Failed to verify purchase history. Please try again later.',
    }
  }
}

/**
 * Helper to calculate average rating and total review count from a list of reviews
 */
export function calculateProductRating(reviews: Array<{ rating: number }>): { average: number; count: number } {
  if (!reviews || reviews.length === 0) {
    return { average: 5.0, count: 0 }
  }

  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  const average = Number((sum / reviews.length).toFixed(1))
  return { average, count: reviews.length }
}
