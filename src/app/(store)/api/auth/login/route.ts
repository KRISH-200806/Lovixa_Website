import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    const result = await payload.login({
      collection: 'users',
      data: {
        email: email.toLowerCase().trim(),
        password,
      },
    })

    if (!result || !result.token || !result.user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: (result.user as any).name || (result.user.email ? result.user.email.split('@')[0] : 'Customer'),
        role: (result.user as any).role || 'customer',
        phone: (result.user as any).phone,
        savedAddresses: (result.user as any).savedAddresses || [],
      },
      token: result.token,
    })
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  }
}
