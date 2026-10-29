import { NextResponse } from 'next/server'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { sendContactInquiryNotificationEmail } from '@/lib/email/otp-mailer'

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req)
    if (!checkRateLimit(`contact_${clientIp}`, { limit: 5, windowMs: 10 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Too many contact requests from this connection. Please try again later.' },
        { status: 429 }
      )
    }

    const { name, email, phone, message } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Please enter your name.' },
        { status: 400 }
      )
    }

    try {
      const payload = await getPayloadCached()
      await payload.create({
        collection: 'form-submissions',
        data: {
          formType: 'contact',
          status: 'new',
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: typeof phone === 'string' ? phone.trim() : '',
          message: typeof message === 'string' ? message.trim() : '',
        },
      })
    } catch (dbErr) {
      console.warn('Database offline, inquiry logged in console:', { name, email, phone, message })
    }

    // Send instant email notification to store admin (lovixacosmetic@gmail.com)
    try {
      await sendContactInquiryNotificationEmail({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: typeof phone === 'string' ? phone.trim() : '',
        message: typeof message === 'string' ? message.trim() : '',
      })
    } catch (mailErr) {
      console.warn('Admin notification email failed (non-blocking):', mailErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 24 hours.',
    })
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Unable to send message right now. Please try again.' },
      { status: 500 }
    )
  }
}
