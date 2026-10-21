import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const requestHeaders = await headers()
    const { user } = await payload.auth({ headers: requestHeaders })

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: (user as any).name || (user.email ? user.email.split('@')[0] : 'Customer'),
        role: (user as any).role || 'customer',
        phone: (user as any).phone,
        savedAddresses: (user as any).savedAddresses || [],
      },
    })
  } catch (err: any) {
    console.error('Auth check error:', err)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
