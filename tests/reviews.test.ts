import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { hasCustomerPurchasedProduct, calculateProductRating } from '../src/lib/reviews/reviews'

describe('Reviews Verified Purchaser Verification Engine', () => {
  it('rejects review when no orders exist for the customer email', async () => {
    const mockPayload = {
      find: async () => ({ docs: [] }),
    }

    const result = await hasCustomerPurchasedProduct(mockPayload, {
      productId: 'prod-123',
      customerEmail: 'alice@example.com',
    })

    assert.equal(result.purchased, false)
    assert.match(result.reason || '', /No orders found/)
  })

  it('rejects review when customer has orders but has not purchased the target product', async () => {
    const mockPayload = {
      find: async () => ({
        docs: [
          {
            id: 'ord-1',
            paymentStatus: 'paid',
            fulfillmentStatus: 'delivered',
            items: [
              { productId: 'prod-999', title: 'Other Product' },
              { productId: 'prod-888', title: 'Another Product' },
            ],
          },
        ],
      }),
    }

    const result = await hasCustomerPurchasedProduct(mockPayload, {
      productId: 'prod-123',
      customerEmail: 'alice@example.com',
    })

    assert.equal(result.purchased, false)
    assert.match(result.reason || '', /no completed purchase contains this specific product/)
  })

  it('rejects review if the order containing the product was failed or cancelled', async () => {
    const mockPayload = {
      find: async () => ({
        docs: [
          {
            id: 'ord-1',
            paymentStatus: 'failed',
            fulfillmentStatus: 'unfulfilled',
            items: [{ productId: 'prod-123', title: 'Target Product' }],
          },
          {
            id: 'ord-2',
            paymentStatus: 'paid',
            fulfillmentStatus: 'cancelled',
            items: [{ productId: 'prod-123', title: 'Target Product' }],
          },
        ],
      }),
    }

    const result = await hasCustomerPurchasedProduct(mockPayload, {
      productId: 'prod-123',
      customerEmail: 'alice@example.com',
    })

    assert.equal(result.purchased, false)
  })

  it('approves review when customer has a valid paid/pending order with the target product by email', async () => {
    const mockPayload = {
      find: async () => ({
        docs: [
          {
            id: 'ord-1',
            paymentStatus: 'paid',
            fulfillmentStatus: 'processing',
            items: [
              { productId: 'prod-456', title: 'Item 1' },
              { productId: 'prod-123', title: 'Target Product' },
            ],
          },
        ],
      }),
    }

    const result = await hasCustomerPurchasedProduct(mockPayload, {
      productId: 'prod-123',
      customerEmail: 'Alice@Example.COM',
    })

    assert.equal(result.purchased, true)
    assert.equal(result.reason, undefined)
  })

  it('approves review when customer matches by customerId even with different email casing', async () => {
    const mockPayload = {
      find: async (args: any) => {
        assert.ok(args.where.or.length >= 1)
        return {
          docs: [
            {
              id: 'ord-2',
              customer: 'user-789',
              paymentStatus: 'paid',
              fulfillmentStatus: 'delivered',
              items: [{ productId: 'prod-999', title: 'Awesome Item' }],
            },
          ],
        }
      },
    }

    const result = await hasCustomerPurchasedProduct(mockPayload, {
      productId: 'prod-999',
      customerEmail: 'someone@domain.com',
      customerId: 'user-789',
    })

    assert.equal(result.purchased, true)
  })

  it('correctly calculates average rating and total counts', () => {
    const emptyResult = calculateProductRating([])
    assert.deepEqual(emptyResult, { average: 5.0, count: 0 })

    const reviews = [
      { rating: 5 },
      { rating: 4 },
      { rating: 5 },
      { rating: 4 },
    ]
    const ratingResult = calculateProductRating(reviews)
    assert.deepEqual(ratingResult, { average: 4.5, count: 4 })
  })
})
