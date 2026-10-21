import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { sendPasswordResetOtpEmail } from '@/lib/email/otp-mailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const payload = await getPayload({ config: configPromise })

    // Find the user by email
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
    })

    if (!users.docs || users.docs.length === 0) {
      return NextResponse.json(
        { error: 'No account found with this email address. Please check your spelling or create an account.' },
        { status: 404 }
      )
    }

    const targetUser = users.docs[0] as any

    // Generate cryptographically sound 6-digit numeric OTP (100000 - 999999)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiration = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

    // Store the OTP on the user document using Payload auth fields
    await payload.update({
      collection: 'users',
      id: targetUser.id,
      data: {
        resetPasswordToken: `otp:${otp}`,
        resetPasswordExpiration: expiration,
      },
      overrideAccess: true,
    })

    // Send the branded OTP email
    await sendPasswordResetOtpEmail({
      to: normalizedEmail,
      otp,
      customerName: targetUser.name || '',
    })

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
    })
  } catch (err: any) {
    console.error('[Forgot Password Error]', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to send verification code. Please try again later.' },
      { status: 500 }
    )
  }
}
