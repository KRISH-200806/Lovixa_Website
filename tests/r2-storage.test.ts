import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  getR2Config,
  buildR2PublicUrl,
  getR2DiagnosticInfo,
} from '../src/lib/storage/r2-config'
import { Media } from '../src/collections/Media'

describe('Cloudflare R2 Media Storage Suite', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    // Reset process.env to clean baseline before each test
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  describe('R2 Configuration & Safe Placeholder Detection', () => {
    it('detects unconfigured/placeholder credentials and marks isConfigured as false', () => {
      process.env.R2_BUCKET = 'lovixa-media'
      process.env.R2_ACCOUNT_ID = 'YOUR_ACCOUNT_ID'
      process.env.R2_ACCESS_KEY_ID = 'YOUR_ACCESS_KEY_ID'
      process.env.R2_SECRET_ACCESS_KEY = 'YOUR_SECRET_ACCESS_KEY'
      process.env.R2_ENDPOINT = 'https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com'

      const config = getR2Config()
      assert.equal(config.isConfigured, false)
      assert.equal(config.bucket, 'lovixa-media')
    })

    it('marks isConfigured as false if access key or secret is too short or missing', () => {
      process.env.R2_BUCKET = 'lovixa-media'
      process.env.R2_ENDPOINT = 'https://1234567890abcdef.r2.cloudflarestorage.com'
      process.env.R2_ACCESS_KEY_ID = 'short'
      process.env.R2_SECRET_ACCESS_KEY = '123'

      const config = getR2Config()
      assert.equal(config.isConfigured, false)
    })

    it('validates active R2 credentials when legitimate production values are provided', () => {
      process.env.R2_BUCKET = 'lovixa-media-prod'
      process.env.R2_ACCOUNT_ID = '1234567890abcdef1234567890abcdef'
      process.env.R2_ENDPOINT = 'https://1234567890abcdef1234567890abcdef.r2.cloudflarestorage.com'
      process.env.R2_ACCESS_KEY_ID = '0123456789abcdef0123456789abcdef'
      process.env.R2_SECRET_ACCESS_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef'
      process.env.R2_PUBLIC_URL = 'https://media.lovixacosmetic.com'

      const config = getR2Config()
      assert.equal(config.isConfigured, true)
      assert.equal(config.bucket, 'lovixa-media-prod')
      assert.equal(config.publicUrl, 'https://media.lovixacosmetic.com')
      assert.equal(config.region, 'auto')
    })

    it('gracefully falls back to S3_* environment variables for compatibility', () => {
      delete process.env.R2_BUCKET
      delete process.env.R2_ACCOUNT_ID
      delete process.env.R2_ENDPOINT
      delete process.env.R2_ACCESS_KEY_ID
      delete process.env.R2_SECRET_ACCESS_KEY
      delete process.env.R2_PUBLIC_URL

      process.env.S3_BUCKET = 'legacy-s3-bucket'
      process.env.S3_ENDPOINT = 'https://s3.compat.cloudflarestorage.com'
      process.env.S3_ACCESS_KEY_ID = 'valid_access_key_12345'
      process.env.S3_SECRET_ACCESS_KEY = 'valid_secret_key_1234567890abcdef'

      const config = getR2Config()
      assert.equal(config.bucket, 'legacy-s3-bucket')
      assert.equal(config.endpoint, 'https://s3.compat.cloudflarestorage.com')
      assert.equal(config.isConfigured, true)
    })
  })

  describe('Public Media URL Delivery Engine', () => {
    it('generates custom domain URL when R2_PUBLIC_URL is configured', () => {
      process.env.R2_PUBLIC_URL = 'https://media.lovixacosmetic.com'

      const url = buildR2PublicUrl({ filename: 'product-shampoo-500ml.webp' })
      assert.equal(url, 'https://media.lovixacosmetic.com/product-shampoo-500ml.webp')
    })

    it('correctly handles path prefixes and prevents double slashes', () => {
      process.env.R2_PUBLIC_URL = 'https://media.lovixacosmetic.com/'

      const url = buildR2PublicUrl({
        filename: '/banners/summer-campaign.jpg',
        prefix: '/hero-media/',
      })
      assert.equal(url, 'https://media.lovixacosmetic.com/hero-media/banners/summer-campaign.jpg')
    })

    it('supports publicUrlOverride dynamically', () => {
      process.env.R2_PUBLIC_URL = 'https://media.lovixacosmetic.com'

      const url = buildR2PublicUrl({
        filename: 'custom.png',
        publicUrlOverride: 'https://pub-abc123xyz.r2.dev',
      })
      assert.equal(url, 'https://pub-abc123xyz.r2.dev/custom.png')
    })

    it('falls back to local /media path when R2 is in placeholder mode', () => {
      delete process.env.R2_PUBLIC_URL
      delete process.env.S3_PUBLIC_URL
      process.env.R2_ENDPOINT = 'https://your-account-id.r2.cloudflarestorage.com'

      const url = buildR2PublicUrl({ filename: 'local-test.png' })
      assert.equal(url, '/media/local-test.png')
    })
  })

  describe('Diagnostic Information & Secret Redaction', () => {
    it('strictly redacts credentials and masks account ID in diagnostics', () => {
      process.env.R2_BUCKET = 'lovixa-media'
      process.env.R2_ENDPOINT = 'https://a1b2c3d4e5f6.r2.cloudflarestorage.com'
      process.env.R2_ACCESS_KEY_ID = 'KEY1234567890XYZ'
      process.env.R2_SECRET_ACCESS_KEY = 'SUPER_SECRET_PAYLOAD_KEY_DO_NOT_LEAK'

      const diag = getR2DiagnosticInfo()
      assert.equal(diag.bucket, 'lovixa-media')
      assert.equal(diag.endpoint, 'https://[REDACTED].r2.cloudflarestorage.com')
      assert.equal(diag.hasAccessKey, true)
      assert.equal(diag.hasSecretKey, true)
      // Preview should only show the first and last 4 characters
      assert.equal(diag.accessKeyPreview, 'KEY1...0XYZ')
      // Secret key must never appear anywhere in the diagnostic object
      const serialized = JSON.stringify(diag)
      assert.equal(serialized.includes('SUPER_SECRET'), false)
    })
  })

  describe('Media Collection Security & Architecture', () => {
    it('enforces required alt text for SEO and accessibility', () => {
      const altField = Media.fields.find((f) => 'name' in f && f.name === 'alt')
      assert.ok(altField, 'alt field must exist on Media collection')
      if (altField && 'required' in altField) {
        assert.equal(altField.required, true)
      }
    })

    it('whitelists only authorized image MIME types and blocks arbitrary files', () => {
      assert.ok(Media.upload, 'Media collection must have upload configuration')
      if (typeof Media.upload === 'object') {
        const allowed = Media.upload.mimeTypes || []
        assert.ok(allowed.includes('image/jpeg'))
        assert.ok(allowed.includes('image/png'))
        assert.ok(allowed.includes('image/webp'))
        assert.ok(allowed.includes('image/avif'))
        // Should not allow dangerous arbitrary executable files
        assert.equal(allowed.includes('application/x-msdownload'), false)
        assert.equal(allowed.includes('text/html'), false)
        assert.equal(allowed.includes('application/javascript'), false)
      }
    })

    it('enforces role-based permissions (only admin can delete media documents)', () => {
      assert.ok(Media.access?.delete)
      const mockAdminReq = { req: { user: { role: 'admin' } } } as any
      const mockCustomerReq = { req: { user: { role: 'customer' } } } as any
      const mockAnonymousReq = { req: {} } as any

      assert.equal(Media.access.delete(mockAdminReq), true)
      assert.equal(Media.access.delete(mockCustomerReq), false)
      assert.equal(Media.access.delete(mockAnonymousReq), false)
    })
  })
})
