import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, otp, newPassword } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      )
    }

    if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
      return NextResponse.json(
        { error: 'Please enter the complete 6-digit verification code.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const cleanOtp = otp.trim()

    const payload = await getPayload({ config: configPromise })

    // Find the user by email with hidden auth fields visible
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
      showHiddenFields: true,
    })

    if (!users.docs || users.docs.length === 0) {
      return NextResponse.json(
        { error: 'No account found with this email address.' },
        { status: 404 }
      )
    }

    const targetUser = users.docs[0] as any

    // Verify OTP match
    const storedToken = targetUser.resetPasswordToken
    if (!storedToken || storedToken !== `otp:${cleanOtp}`) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please check your email and try again.' },
        { status: 400 }
      )
    }

    // Verify OTP expiration
    const expiration = targetUser.resetPasswordExpiration
    if (!expiration || new Date(expiration).getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'This verification code has expired. Please click "Resend code" to get a new one.' },
        { status: 400 }
      )
    }

    // Generate a secure one-time reset token (valid for 15 minutes)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    // Store verified reset token in database
    await payload.update({
      collection: 'users',
      id: targetUser.id,
      data: {
        resetPasswordToken: `verified:${resetToken}`,
        resetPasswordExpiration: tokenExpiration,
      },
      overrideAccess: true,
    })

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully! You can now set your new password.',
      resetToken,
    })
  } catch (err: any) {
    console.error('[Verify OTP Error]', err)
    return NextResponse.json(
      { error: err?.message || 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
