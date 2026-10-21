import { NextRequest } from 'next/server'
import { GET as mediaGet } from '@/app/media/[...path]/route'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return mediaGet(request, context)
}
