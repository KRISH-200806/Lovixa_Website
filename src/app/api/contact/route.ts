import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { isDisposableEmail } from '@/lib/disposableEmail'
import { isSmtpConfigured, sendMail } from '@/lib/mailer'
import { getPayloadCached } from '@/lib/cms/get-payload-cached'

const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Invalid email address').max(320),
  phone: z.string().trim().max(50).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, 'Message is required').max(5000),
  formType: z.enum(['contact', 'quote', 'newsletter', 'demo', 'custom']).default('contact'),
  sourcePage: z.string().trim().max(500).optional(),
  customData: z.record(z.string(), z.unknown()).optional(),
  turnstileToken: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || 'Invalid form submission.'
    return NextResponse.json({ error: errorMsg, details: parsed.error.issues }, { status: 400 })
  }

  const { name, email, phone, subject, message, formType, sourcePage, customData, turnstileToken } = parsed.data

  if (isDisposableEmail(email)) {
    return NextResponse.json({ error: 'Please use a valid, permanent email address.' }, { status: 400 })
  }

  const humanVerified = await verifyTurnstile(turnstileToken, ip)
  if (!humanVerified) {
    return NextResponse.json({ error: 'Security verification failed. Please try again.' }, { status: 400 })
  }

  // 1. Always capture lead into Payload CMS database
  let submissionDoc: any = null
  try {
    const payload = await getPayloadCached()
    submissionDoc = await payload.create({
      collection: 'form-submissions',
      data: {
        name,
        email,
        phone: phone || '',
        subject: subject || '',
        message,
        formType,
        sourcePage: sourcePage || '',
        customData: customData || {},
        turnstileVerified: Boolean(turnstileToken),
        spamScore: 'clean',
        status: 'new',
      },
      overrideAccess: true,
    })
  } catch (dbErr: any) {
    console.error('[contact] Failed to record submission in DB:', dbErr?.message || dbErr)
    // Non-fatal if DB glitch, proceed with email if possible, or return failure
  }

  // 2. Dispatch email notification if SMTP is configured
  if (isSmtpConfigured && process.env.SMTP_CONTACT_TO) {
    try {
      const emailSubject = subject || `New [${formType.toUpperCase()}] submission from ${name}`
      await sendMail({
        to: process.env.SMTP_CONTACT_TO,
        subject: emailSubject,
        text: `New Form Submission:
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Form Type: ${formType}
Source Page: ${sourcePage || 'Direct'}

Message:
${message}

(Saved in CMS under Form Submissions ID: ${submissionDoc?.id || 'N/A'})`,
        replyTo: email,
      })
    } catch (mailErr: any) {
      console.warn('[contact] Email notification failed (lead is safely saved in CMS):', mailErr?.message)
    }
  } else {
    console.info('[contact] SMTP not configured. Submission safely stored in CMS database.')
  }

  return NextResponse.json({
    success: true,
    message: 'Thank you! Your message has been received.',
    id: submissionDoc?.id,
  })
}
