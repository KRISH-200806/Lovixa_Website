import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, resetToken, newPassword } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      )
    }

    if (!resetToken || typeof resetToken !== 'string') {
      return NextResponse.json(
        { error: 'Session expired or invalid reset token. Please verify OTP again.' },
        { status: 400 }
      )
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    const payload = await getPayload({ config: configPromise })

    // Find user with hidden auth fields
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
      showHiddenFields: true,
    })

    if (!users.docs || users.docs.length === 0) {
      return NextResponse.json(
        { error: 'Account not found. Please try again.' },
        { status: 404 }
      )
    }

    const targetUser = users.docs[0] as any

    // Verify reset token match
    const storedToken = targetUser.resetPasswordToken
    if (!storedToken || storedToken !== `verified:${resetToken.trim()}`) {
      return NextResponse.json(
        { error: 'Invalid or expired reset session. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Verify expiration
    const expiration = targetUser.resetPasswordExpiration
    if (!expiration || new Date(expiration).getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'Your reset session has expired. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Update user password and clear tokens
    await payload.update({
      collection: 'users',
      id: targetUser.id,
      data: {
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpiration: null,
      },
      overrideAccess: true,
    })

    // Automatically log in the user
    let token: string | undefined = undefined
    try {
      const loginResult = await payload.login({
        collection: 'users',
        data: {
          email: normalizedEmail,
          password: newPassword,
        },
      })

      if (loginResult && loginResult.token) {
        token = loginResult.token
        const cookieStore = await cookies()
        cookieStore.set('payload-token', loginResult.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      }
    } catch (loginErr) {
      console.warn('Auto-login warning after password update:', loginErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully!',
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name || targetUser.email.split('@')[0],
        role: targetUser.role || 'customer',
        phone: targetUser.phone,
      },
      token,
    })
  } catch (err: any) {
    console.error('[Reset Password Error]', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to update password. Please try again.' },
      { status: 500 }
    )
  }
}
