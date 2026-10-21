import { NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const payload = await getPayloadCached()

    // Check if already subscribed
    const existing = await payload.find({
      collection: 'form-submissions',
      where: {
        and: [
          { email: { equals: email.toLowerCase().trim() } },
          { formType: { equals: 'newsletter' } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to the LOVIXA community!',
      })
    }

    await payload.create({
      collection: 'form-submissions',
      data: {
        formType: 'newsletter',
        email: email.toLowerCase().trim(),
        message: 'Subscribed to LOVIXA newsletter updates.',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you for joining the LOVIXA community!',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Unable to process subscription right now. Please try again.' },
      { status: 500 }
    )
  }
}
