import 'dotenv/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections
import { Users } from './collections/Users'
import { Products } from './collections/Products'
import { ProductVariants } from './collections/ProductVariants'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'
import { Orders } from './collections/Orders'
import { Carts } from './collections/Carts'
import { Coupons } from './collections/Coupons'
import { Reviews } from './collections/Reviews'
import { Media } from './collections/Media'
import { AuditLogs } from './collections/AuditLogs'
import { FormSubmissions } from './collections/FormSubmissions'
import { SeoReports } from './collections/SeoReports'
import { KeywordLinks } from './collections/KeywordLinks'
import { SectionSourceMap } from './collections/SectionSourceMap'
import { InventoryTransactions } from './collections/InventoryTransactions'
import { Pages } from './collections/Pages'
import { BlogPosts } from './collections/BlogPosts'

// Globals
import { StoreSettings } from './globals/StoreSettings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { ThemeSettings } from './globals/ThemeSettings'
import { LanguageSettings } from './globals/LanguageSettings'
import { Homepage } from './globals/Homepage'
import { SEOSettings } from './globals/SEOSettings'
import { AnnouncementBar } from './globals/AnnouncementBar'
import { getR2Config, buildR2PublicUrl } from './lib/storage/r2-config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Cloudflare R2 / S3 Storage Config
const r2 = getR2Config()

// Detect if database is MongoDB (either by MONGODB_URI or mongodb:// in DATABASE_URL)
const mongoUri = process.env.MONGODB_URI || (process.env.DATABASE_URL?.startsWith('mongodb') ? process.env.DATABASE_URL : null)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | LOVIXA COSMETIC Admin',
    },
  },
  localization: {
    locales: [
      { label: 'English (US)', code: 'en' },
      { label: 'Español (Spanish)', code: 'es' },
      { label: 'Deutsch (German)', code: 'de' },
      { label: 'Français (French)', code: 'fr' },
      { label: 'العربية (Arabic)', code: 'ar', rtl: true },
      { label: 'हिन्दी (Hindi)', code: 'hi' },
      { label: 'ગુજરાતી (Gujarati)', code: 'gu' },
      { label: '日本語 (Japanese)', code: 'ja' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [
    Products,
    ProductVariants,
    Categories,
    Brands,
    Orders,
    Carts,
    Coupons,
    Reviews,
    Users,
    Media,
    InventoryTransactions,
    Pages,
    BlogPosts,
    AuditLogs,
    FormSubmissions,
    SeoReports,
    KeywordLinks,
    SectionSourceMap,
  ],
  globals: [
    Homepage,
    StoreSettings,
    AnnouncementBar,
    SEOSettings,
    Header,
    Footer,
    ThemeSettings,
    LanguageSettings,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret-for-development-only-replace-in-prod',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongoUri
    ? mongooseAdapter({
        url: mongoUri,
      })
    : postgresAdapter({
        pool: {
          connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ecommerce_store',
        },
        push: true,
        migrationDir: './migrations',
      }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['products', 'categories', 'pages', 'blog-posts'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const data = (doc || {}) as Record<string, unknown>
        const title = typeof data.title === 'string' ? data.title.trim() : typeof data.name === 'string' ? data.name.trim() : ''
        return title ? `${title} | LOVIXA COSMETIC` : 'LOVIXA COSMETIC | Botanical Hair Care'
      },
      generateDescription: ({ doc }) => {
        const data = (doc || {}) as Record<string, unknown>
        const shortDesc = typeof data.shortDescription === 'string' ? data.shortDescription.trim() : typeof data.description === 'string' ? data.description.trim() : ''
        return shortDesc || 'Embrace Your Natural Beauty with LOVIXA Ayurvedic & Botanical Hair Care Essentials.'
      },
    }),
    redirectsPlugin({
      collections: ['products'],
    }),
    ...(process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY !== 'sk_test_51...' &&
    !process.env.STRIPE_SECRET_KEY.includes('...')
      ? [
          stripePlugin({
            stripeSecretKey: process.env.STRIPE_SECRET_KEY,
            isTestKey: Boolean(process.env.STRIPE_SECRET_KEY?.startsWith('sk_test')),
            stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
          }),
        ]
      : []),
    ...(r2.isConfigured
      ? [
          s3Storage({
            collections: {
              media: {
                generateFileURL: ({ filename, prefix }) =>
                  buildR2PublicUrl({ filename: filename || '', prefix }),
                disablePayloadAccessControl: true,
              },
            },
            bucket: r2.bucket,
            disableLocalStorage: true,
            config: {
              credentials: {
                accessKeyId: r2.accessKeyId,
                secretAccessKey: r2.secretAccessKey,
              },
              region: r2.region,
              endpoint: r2.endpoint,
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
})
