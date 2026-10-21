'use client'

import React, { useEffect, useState } from 'react'
import Hero from '@/components/sections/shared/Hero'
import ContentSection from '@/components/sections/shared/ContentSection'
import Faq from '@/components/sections/shared/Faq'
import PageAccentStyle from '@/components/ui/PageAccentStyle'
import { JsonLd, breadcrumbSchema } from '@/lib/seo/jsonld'

export type LivePageData = {
  id?: unknown
  title?: string
  hero?: {
    title?: string
    subtitle?: string
    accentColor?: string
  }
  sections?: Array<{
    blockType?: string
    id?: string
    clientId?: string
    [key: string]: unknown
  }>
  [key: string]: unknown
}

type LivePreviewWrapperProps = {
  initialData: LivePageData
  fallbackAccentColor?: string
  breadcrumbTitle?: string
  breadcrumbPath?: string
}

/**
 * Client-side Live Preview wrapper component.
 * When the page is viewed inside Payload CMS's live preview iframe,
 * it listens for `payload-live-preview` postMessage events sent from the parent
 * admin window and merges real-time form edits instantly into view.
 */
export function LivePreviewWrapper({
  initialData,
  fallbackAccentColor,
  breadcrumbTitle = 'Home',
  breadcrumbPath = '/',
}: LivePreviewWrapperProps) {
  const [data, setData] = useState<LivePageData>(initialData)

  useEffect(() => {
    // Only bind listener if running in a browser environment
    if (typeof window === 'undefined') return

    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return

      let incomingData: LivePageData | null = null

      if (event.data.type === 'payload-live-preview' || event.data.type === 'live-preview') {
        incomingData = (event.data.data || event.data.doc || event.data) as LivePageData
      } else if (event.data.data && typeof event.data.data === 'object') {
        incomingData = event.data.data as LivePageData
      } else if (event.data.sections || event.data.hero || event.data.title) {
        incomingData = event.data as LivePageData
      }

      if (incomingData && typeof incomingData === 'object') {
        setData((prev) => {
          const rawSections = incomingData?.sections ?? prev?.sections ?? []
          const nextSections = Array.isArray(rawSections) ? rawSections : []
          const nextHero = incomingData?.hero
            ? { ...(prev?.hero || {}), ...incomingData.hero }
            : prev?.hero

          return {
            ...prev,
            ...incomingData,
            hero: nextHero,
            sections: nextSections,
          }
        })
      }
    }

    window.addEventListener('message', handleMessage)

    // Notify parent window that preview listener is ready
    const sendReady = () => {
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
        try {
          window.parent.postMessage({ type: 'payload-live-preview', ready: true }, '*')
          window.parent.postMessage({ type: 'payload-live-preview-ready' }, '*')
          window.parent.postMessage({ type: 'ready' }, '*')
        } catch {}
      }
    }

    sendReady()
    const timer1 = setTimeout(sendReady, 300)
    const timer2 = setTimeout(sendReady, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const accentColor = data?.hero?.accentColor || fallbackAccentColor

  return (
    <>
      <PageAccentStyle color={accentColor} />
      <JsonLd data={breadcrumbSchema([{ name: breadcrumbTitle || data.title || 'Page', path: breadcrumbPath }])} />
      {data?.hero && <Hero hero={data.hero} />}
      {Array.isArray(data?.sections) &&
        data.sections.map((block, index) => {
          const blockType =
            block.blockType ||
            (block as Record<string, unknown>).slug ||
            (block as Record<string, unknown>).type
          if (blockType === 'content') {
            return <ContentSection key={block.id || block.clientId || index} block={block as never} />
          }
          if (blockType === 'faq') {
            return <Faq key={block.id || block.clientId || index} block={block as never} />
          }
          return null
        })}
    </>
  )
}
