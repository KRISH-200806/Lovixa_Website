import type { CollectionConfig } from 'payload'

/**
 * Checks whether a given media ID is referenced by catalog or content documents.
 * Protects against accidental deletion of shared product or category imagery.
 */
async function checkMediaInUse(payload: any, mediaId: string): Promise<string | null> {
  try {
    // 1. Products
    const products = await payload.find({
      collection: 'products',
      where: { 'images.image': { equals: mediaId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (products.docs && products.docs.length > 0) {
      return `Product "${products.docs[0].title || mediaId}"`
    }

    // 2. Product Variants
    const variants = await payload.find({
      collection: 'product-variants',
      where: { image: { equals: mediaId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (variants.docs && variants.docs.length > 0) {
      return `Product Variant "${variants.docs[0].sku || mediaId}"`
    }

    // 3. Categories
    const categories = await payload.find({
      collection: 'categories',
      where: { image: { equals: mediaId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (categories.docs && categories.docs.length > 0) {
      return `Category "${categories.docs[0].name || mediaId}"`
    }

    // 4. Brands
    const brands = await payload.find({
      collection: 'brands',
      where: { logo: { equals: mediaId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (brands.docs && brands.docs.length > 0) {
      return `Brand "${brands.docs[0].name || mediaId}"`
    }

    // 5. Blog Posts
    const posts = await payload.find({
      collection: 'blog-posts',
      where: {
        or: [
          { featuredImage: { equals: mediaId } },
          { 'seo.ogImage': { equals: mediaId } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (posts.docs && posts.docs.length > 0) {
      return `Blog Post "${posts.docs[0].title || mediaId}"`
    }

    // 6. Pages
    const pages = await payload.find({
      collection: 'pages',
      where: {
        or: [
          { headerImage: { equals: mediaId } },
          { 'seo.ogImage': { equals: mediaId } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (pages.docs && pages.docs.length > 0) {
      return `Page "${pages.docs[0].title || mediaId}"`
    }
  } catch (err) {
    // Do not crash if a check encounters an unexpected issue
    console.warn('[Media.beforeDelete] Warning during dependency check:', err)
  }

  return null
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: 'Admin',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
    delete: ({ req: { user } }) => Boolean(user && user.role === 'admin'),
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, position: 'centre' },
      { name: 'card', width: 768, height: 768, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/svg+xml',
    ],
    focalPoint: true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Sanitize filename to prevent path traversal
        if (data?.filename && typeof data.filename === 'string') {
          data.filename = data.filename.replace(/\.\.+/g, '').replace(/[/\\]/g, '')
        }
        // Normalize alt text
        if (data?.alt && typeof data.alt === 'string') {
          data.alt = data.alt.trim()
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        // Support force deletion via query param ?force=true or internal context flag
        const queryForce = typeof req.query?.force === 'string' && req.query.force === 'true'
        const contextForce = Boolean((req as any).context?.forceDelete)
        if (queryForce || contextForce) {
          return
        }

        const inUseBy = await checkMediaInUse(req.payload, String(id))
        if (inUseBy) {
          throw new Error(
            `Cannot delete media item: it is currently referenced by ${inUseBy}. Remove the image reference before deleting this media record.`
          )
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive alt text for accessibility and SEO image search.',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}

