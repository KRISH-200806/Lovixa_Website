import type { SeoCheckResult, SeoReportInput } from '../types'

const MODERN_FORMAT = /\.(webp|avif)(\?.*)?$/i

export function checkImages(input: SeoReportInput): SeoCheckResult[] {
  const results: SeoCheckResult[] = []

  if (input.images.length === 0) {
    results.push({
      id: 'images.none',
      category: 'images',
      label: 'Image checks',
      mode: 'auto',
      status: 'na',
      message: 'No images on this page.',
    })
    return results
  }

  const missingAlt = input.images.filter((img) => !img.alt || !img.alt.trim())
  results.push({
    id: 'images.alt-text',
    category: 'images',
    label: 'All images have alt text',
    mode: 'auto',
    status: missingAlt.length === 0 ? 'pass' : 'fail',
    message: `${missingAlt.length} of ${input.images.length} image(s) missing alt text.`,
  })

  const genericAlt = input.images.filter((img) => {
    const alt = img.alt?.trim().toLowerCase() || ''
    return (
      /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(alt) ||
      ['image', 'photo', 'picture', 'img', 'banner', 'hero', 'pic'].includes(alt)
    )
  })
  results.push({
    id: 'images.descriptive-alt',
    category: 'images',
    label: 'Image alt text is descriptive (not filenames or placeholders)',
    mode: 'auto',
    status: genericAlt.length === 0 ? 'pass' : 'warn',
    message:
      genericAlt.length === 0
        ? 'All present alt texts are descriptive.'
        : `${genericAlt.length} image(s) use a filename or generic word ("image", "photo") as alt text. Write descriptive descriptions.`,
  })

  const legacyFormat = input.images.filter((img) => img.url && !MODERN_FORMAT.test(img.url))
  results.push({
    id: 'images.modern-format',
    category: 'images',
    label: 'Images use modern format (WebP/AVIF)',
    mode: 'auto',
    status: legacyFormat.length === 0 ? 'pass' : 'warn',
    message:
      legacyFormat.length === 0
        ? 'All images WebP/AVIF (or format unresolved by storage adapter).'
        : `${legacyFormat.length} image(s) not in WebP/AVIF — Payload's Sharp/media pipeline can convert on upload.`,
  })

  return results
}
