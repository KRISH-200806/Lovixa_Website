export function resolveSeoTitle(metaTitle: unknown, fallbackTitle: string) {
  if (typeof metaTitle === 'string' && metaTitle.trim()) return metaTitle.trim()
  return fallbackTitle
}

export function resolveSeoDescription(metaDescription: unknown, fallbackDescription: string) {
  if (typeof metaDescription === 'string' && metaDescription.trim()) return metaDescription.trim()
  return fallbackDescription
}

export function resolveSeoImage(metaImage: unknown, fallbackImage: string) {
  if (metaImage && typeof metaImage === 'object' && 'url' in metaImage) {
    const url = (metaImage as { url?: unknown }).url
    if (typeof url === 'string' && url) return url
  }
  return fallbackImage
}
