'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { getMediaUrl } from '@/utils/getMediaUrl'

const PLACEHOLDER_SRC = '/media-placeholder.svg'

type MediaDoc = string | number | { url?: string | null; filename?: string | null } | null | undefined

type SafeImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  /** Payload media doc, ID string, or raw URL — resolved via getMediaUrl(). */
  media: MediaDoc
  alt: string
}

/**
 * next/image wrapper that never shows a broken-image icon. Falls back to
 * public/media-placeholder.svg when the resolved URL fails to load (deleted
 * S3 object, bad key, network failure) or when there's no media at all
 * (empty/unset field) — same no-op-safe contract as the analytics
 * components: missing data degrades visibly, never breaks the layout.
 *
 * Always use this instead of a raw next/image <Image> for CMS-sourced media.
 * See starter-kit/25-error-handling-and-asset-fallback.md.
 */
export default function SafeImage({ media, alt, className, ...imageProps }: SafeImageProps) {
  const resolvedUrl = getMediaUrl(media)
  const [failed, setFailed] = useState(false)

  if (failed || !resolvedUrl) {
    // next/image refuses to optimize SVG sources unless images.dangerouslyAllowSVG
    // is set in next.config.mjs — deliberately NOT set here (see
    // 20-security-hardening.md). A plain <img> sidesteps the optimizer
    // entirely for this one tiny static asset, so the placeholder always
    // renders regardless of that flag.
    const isFill = 'fill' in imageProps && imageProps.fill === true
    const width = !isFill && typeof imageProps.width === 'number' ? imageProps.width : undefined
    const height = !isFill && typeof imageProps.height === 'number' ? imageProps.height : undefined
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={PLACEHOLDER_SRC}
        alt="Image unavailable"
        className={className}
        width={width}
        height={height}
        style={isFill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : undefined}
      />
    )
  }

  return (
    <Image {...imageProps} src={resolvedUrl} alt={alt} className={className} onError={() => setFailed(true)} />
  )
}
