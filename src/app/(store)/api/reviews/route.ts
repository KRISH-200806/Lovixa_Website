import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { hasCustomerPurchasedProduct } from '@/lib/reviews/reviews'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')?.trim()

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId parameter' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Resolve target product by MongoDB ObjectId or slug
    let resolvedProductId = productId
    try {
      const productMatches = await payload.find({
        collection: 'products',
        where: {
          or: [
            { id: { equals: productId } },
            { slug: { equals: productId } },
          ],
        },
        limit: 1,
      })

      if (productMatches.docs.length > 0) {
        resolvedProductId = productMatches.docs[0].id
      }
    } catch (e) {
      console.warn('Product resolution notice:', e)
    }

    const result = await payload.find({
      collection: 'reviews',
      where: {
        product: { equals: resolvedProductId },
        status: { equals: 'approved' },
      },
      sort: '-createdAt',
      limit: 100,
    })

    const reviews = (result.docs || []).map((doc: any) => ({
      id: String(doc.id),
      authorName: doc.authorName,
      rating: doc.rating,
      title: doc.title,
      comment: doc.comment,
      isVerifiedBuyer: doc.isVerifiedBuyer ?? true,
      createdAt: doc.createdAt,
    }))

    return NextResponse.json({ reviews })
  } catch (err: any) {
    console.error('Reviews GET error:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { productId, authorName, authorEmail, rating, title, comment, customerId } = body

    if (!productId || !authorName?.trim() || !authorEmail?.trim() || !rating || !comment?.trim() || !title?.trim()) {
      return NextResponse.json(
        { error: 'All fields (name, email, rating, title, and comments) are required.' },
        { status: 400 }
      )
    }

    const numericRating = Number(rating)
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5 stars.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Resolve product ID if slug was passed
    let resolvedProductId = productId
    try {
      const productMatches = await payload.find({
        collection: 'products',
        where: {
          or: [
            { id: { equals: productId } },
            { slug: { equals: productId } },
          ],
        },
        limit: 1,
      })

      if (productMatches.docs.length > 0) {
        resolvedProductId = productMatches.docs[0].id
      }
    } catch (e) {}

    // Strict verified buyer check: only purchasers of this product can review
    const verification = await hasCustomerPurchasedProduct(payload, {
      productId: String(resolvedProductId),
      customerEmail: String(authorEmail),
      customerId: customerId ? String(customerId) : undefined,
    })

    if (!verification.purchased) {
      return NextResponse.json(
        {
          error: 'Review restricted: Only verified customers who purchased this product can leave a review.',
          reason: verification.reason || 'No matching order found for this email address.',
        },
        { status: 403 }
      )
    }

    // Persist verified customer review in database
    const review = await payload.create({
      collection: 'reviews',
      data: {
        product: resolvedProductId,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim().toLowerCase(),
        rating: numericRating,
        title: title.trim(),
        comment: comment.trim(),
        isVerifiedBuyer: true,
        status: 'approved',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your verified customer review has been published.',
        review: {
          id: String(review.id),
          authorName: review.authorName,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          isVerifiedBuyer: true,
        },
      },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Reviews POST error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to submit review' },
      { status: 500 }
    )
  }
}
