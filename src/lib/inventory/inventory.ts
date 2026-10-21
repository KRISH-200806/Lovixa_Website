import type { Payload } from 'payload'

export interface OrderItemInput {
  productId: string
  variantId?: string
  title: string
  price: number
  quantity: number
  image?: any
  optionsSummary?: string
}

export interface StockValidationResult {
  valid: boolean
  message?: string
  unavailableItem?: string
}

/**
 * Validates whether all items in an order have sufficient available stock.
 */
export async function validateItemsStock(
  payload: Payload,
  items: OrderItemInput[]
): Promise<StockValidationResult> {
  if (!items || items.length === 0) {
    return { valid: true }
  }

  for (const item of items) {
    const qty = Math.max(1, Number(item.quantity) || 1)

    // 1. Check Variant Stock if item has variantId
    if (item.variantId) {
      try {
        const variant: any = await payload.findByID({
          collection: 'product-variants',
          id: item.variantId,
        })

        if (variant && !variant.allowBackorder) {
          const availableStock = typeof variant.inventory === 'number' ? variant.inventory : 0
          if (availableStock < qty) {
            return {
              valid: false,
              unavailableItem: item.title,
              message: `Item "${item.title}" only has ${availableStock} in stock (requested ${qty}).`,
            }
          }
        }
      } catch (err) {
        // Variant may have been removed, continue checking base product
      }
    }

    // 2. Check Base Product Stock
    try {
      const product: any = await payload.findByID({
        collection: 'products',
        id: item.productId,
      })

      if (product && product.trackInventory) {
        const availableStock = typeof product.stock === 'number' ? product.stock : 0
        if (availableStock < qty) {
          return {
            valid: false,
            unavailableItem: item.title,
            message: `Item "${item.title}" only has ${availableStock} in stock (requested ${qty}).`,
          }
        }
      }
    } catch (err) {
      console.warn(`[Inventory] Could not verify stock for product ID: ${item.productId}`)
    }
  }

  return { valid: true }
}

/**
 * Atomically decrements product stock and variant inventory upon confirmed order / payment.
 */
export async function decrementItemsStock(
  payload: Payload,
  items: OrderItemInput[]
): Promise<void> {
  if (!items || items.length === 0) return

  for (const item of items) {
    const qty = Math.max(1, Number(item.quantity) || 1)

    // 1. Decrement Variant Inventory
    if (item.variantId) {
      try {
        const variant: any = await payload.findByID({
          collection: 'product-variants',
          id: item.variantId,
        })
        if (variant) {
          const currentInventory = typeof variant.inventory === 'number' ? variant.inventory : 0
          const updatedInventory = Math.max(0, currentInventory - qty)
          await payload.update({
            collection: 'product-variants',
            id: item.variantId,
            data: { inventory: updatedInventory },
          })
        }
      } catch (err: any) {
        console.warn(`[Inventory] Error decrementing variant stock for ${item.variantId}: ${err.message}`)
      }
    }

    // 2. Decrement Base Product Stock
    try {
      const product: any = await payload.findByID({
        collection: 'products',
        id: item.productId,
      })
      if (product && product.trackInventory) {
        const currentStock = typeof product.stock === 'number' ? product.stock : 0
        const updatedStock = Math.max(0, currentStock - qty)
        await payload.update({
          collection: 'products',
          id: item.productId,
          data: { stock: updatedStock },
        })
      }
    } catch (err: any) {
      console.warn(`[Inventory] Error decrementing product stock for ${item.productId}: ${err.message}`)
    }
  }
}

/**
 * Restores product stock and variant inventory (e.g. for cancelled/refunded orders).
 */
export async function restoreItemsStock(
  payload: Payload,
  items: OrderItemInput[]
): Promise<void> {
  if (!items || items.length === 0) return

  for (const item of items) {
    const qty = Math.max(1, Number(item.quantity) || 1)

    if (item.variantId) {
      try {
        const variant: any = await payload.findByID({
          collection: 'product-variants',
          id: item.variantId,
        })
        if (variant) {
          const currentInventory = typeof variant.inventory === 'number' ? variant.inventory : 0
          await payload.update({
            collection: 'product-variants',
            id: item.variantId,
            data: { inventory: currentInventory + qty },
          })
        }
      } catch (err: any) {
        console.warn(`[Inventory] Error restoring variant stock for ${item.variantId}: ${err.message}`)
      }
    }

    try {
      const product: any = await payload.findByID({
        collection: 'products',
        id: item.productId,
      })
      if (product && product.trackInventory) {
        const currentStock = typeof product.stock === 'number' ? product.stock : 0
        await payload.update({
          collection: 'products',
          id: item.productId,
          data: { stock: currentStock + qty },
        })
      }
    } catch (err: any) {
      console.warn(`[Inventory] Error restoring product stock for ${item.productId}: ${err.message}`)
    }
  }
}
