import { cache } from 'react'
import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@/payload.config'

export const getPayloadCached = cache(async (): Promise<Payload> => {
  const resolvedConfig = await Promise.resolve(config)
  return getPayload({ config: resolvedConfig })
})
