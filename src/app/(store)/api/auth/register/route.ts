import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { cookies } from 'next/headers'
import { isDisposableEmail } from '@/lib/disposableEmail'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, phone } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: 'Disposable email addresses are not allowed. Please use a permanent email address.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Check if user already exists
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email.toLowerCase().trim() } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      )
    }

    // Create new customer user
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email: email.toLowerCase().trim(),
        password,
        name: name?.trim() || email.split('@')[0],
        phone: phone?.trim() || undefined,
        role: 'customer',
      },
    })

    // Automatically log in the newly registered user
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: email.toLowerCase().trim(),
        password,
      },
    })

    const cookieStore = await cookies()
    if (loginResult.token) {
      cookieStore.set('payload-token', loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
      },
      token: loginResult.token,
    })
  } catch (err: any) {
    console.error('Registration error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}
