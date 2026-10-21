import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { headers } from 'next/headers'

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const requestHeaders = await headers()
    const { user } = await payload.auth({ headers: requestHeaders })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone, savedAddresses } = body

    const updateData: any = {}
    if (typeof name === 'string') updateData.name = name.trim()
    if (typeof phone === 'string') updateData.phone = phone.trim()
    if (Array.isArray(savedAddresses)) updateData.savedAddresses = savedAddresses

    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone,
        savedAddresses: updatedUser.savedAddresses || [],
      },
    })
  } catch (err: any) {
    console.error('Profile update error:', err)
    return NextResponse.json({ error: err.message || 'Failed to update profile' }, { status: 500 })
  }
}
