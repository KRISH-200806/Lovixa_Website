/**
 * LOVIXA COSMETIC — Cloudflare R2 Storage Configuration & Utilities
 *
 * Implements:
 * 1. Environment variable resolution with fallback (R2_* primary, S3_* compatibility)
 * 2. Active configuration validation (verifying non-placeholder credentials)
 * 3. Public media URL generation via custom domain or public R2 bucket URL
 * 4. Safe diagnostics logging (strictly redacting secrets)
 */

export interface R2Config {
  bucket: string
  accountId?: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  publicUrl?: string
  region: string
  isConfigured: boolean
}

/**
 * Checks if a string looks like an unconfigured template/placeholder
 */
function isPlaceholder(val?: string | null): boolean {
  if (!val) return true
  const lower = val.toLowerCase().trim()
  return (
    lower === '' ||
    lower.includes('your_') ||
    lower.includes('your-account') ||
    lower.includes('your_access') ||
    lower.includes('your_secret') ||
    lower.includes('sk_test_') ||
    lower.includes('...') ||
    lower === 'undefined'
  )
}

/**
 * Resolves R2 storage configuration from environment variables
 */
export function getR2Config(): R2Config {
  const bucket =
    process.env.R2_BUCKET ||
    process.env.S3_BUCKET ||
    'lovixa-media'

  const accountId =
    process.env.R2_ACCOUNT_ID ||
    process.env.CLOUDFLARE_ACCOUNT_ID ||
    undefined

  let endpoint =
    process.env.R2_ENDPOINT ||
    process.env.S3_ENDPOINT ||
    (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : '')

  const accessKeyId =
    process.env.R2_ACCESS_KEY_ID ||
    process.env.S3_ACCESS_KEY_ID ||
    ''

  const secretAccessKey =
    process.env.R2_SECRET_ACCESS_KEY ||
    process.env.S3_SECRET_ACCESS_KEY ||
    ''

  const publicUrl =
    process.env.R2_PUBLIC_URL ||
    process.env.S3_PUBLIC_URL ||
    undefined

  const region =
    process.env.R2_REGION ||
    process.env.S3_REGION ||
    'auto'

  // An active, valid configuration requires non-placeholder credentials and an endpoint
  const isConfigured =
    !isPlaceholder(bucket) &&
    !isPlaceholder(accessKeyId) &&
    !isPlaceholder(secretAccessKey) &&
    !isPlaceholder(endpoint) &&
    accessKeyId.length >= 8 &&
    secretAccessKey.length >= 16

  return {
    bucket,
    accountId,
    endpoint,
    accessKeyId,
    secretAccessKey,
    publicUrl,
    region,
    isConfigured,
  }
}

export function isR2Configured(): boolean {
  return getR2Config().isConfigured
}

/**
 * Validates R2 configuration and returns structured diagnostics/issues
 */
export function validateR2Env(): {
  isValid: boolean
  isPlaceholder: boolean
  issues: string[]
  config: ReturnType<typeof getR2DiagnosticInfo>
} {
  const config = getR2Config()
  const issues: string[] = []

  if (!config.bucket || isPlaceholder(config.bucket)) {
    issues.push('R2_BUCKET is missing or set to placeholder.')
  }
  if (!config.accessKeyId || isPlaceholder(config.accessKeyId)) {
    issues.push('R2_ACCESS_KEY_ID is missing or set to placeholder.')
  } else if (config.accessKeyId.length < 8) {
    issues.push('R2_ACCESS_KEY_ID is suspiciously short (< 8 chars).')
  }
  if (!config.secretAccessKey || isPlaceholder(config.secretAccessKey)) {
    issues.push('R2_SECRET_ACCESS_KEY is missing or set to placeholder.')
  } else if (config.secretAccessKey.length < 16) {
    issues.push('R2_SECRET_ACCESS_KEY is suspiciously short (< 16 chars).')
  }
  if (!config.endpoint || isPlaceholder(config.endpoint)) {
    issues.push('R2_ENDPOINT is missing or set to placeholder.')
  }

  return {
    isValid: config.isConfigured,
    isPlaceholder: !config.isConfigured,
    issues,
    config: getR2DiagnosticInfo(),
  }
}

/**
 * Constructs the public access URL for a media file
 * Uses custom domain (e.g. https://media.lovixacosmetic.com) or public R2 URL
 * Correctly URL-encodes path segments while preserving path separators
 */
export function buildR2PublicUrl({
  filename,
  prefix = '',
  publicUrlOverride,
}: {
  filename?: string | null
  prefix?: string | null
  publicUrlOverride?: string | null
}): string {
  if (!filename || typeof filename !== 'string') return ''

  const config = getR2Config()
  const base = (publicUrlOverride || config.publicUrl || '').replace(/\/+$/, '')

  // Remove leading slashes and split by '/' to encode each path component safely
  const rawClean = filename.replace(/^\/+/, '')
  const encodedFilename = rawClean
    .split('/')
    .map((segment) => encodeURI(segment))
    .join('/')

  const cleanPrefix = prefix
    ? prefix
        .replace(/^\/+|\/+$/g, '')
        .split('/')
        .map((segment) => encodeURI(segment))
        .join('/')
    : ''

  if (base) {
    return cleanPrefix ? `${base}/${cleanPrefix}/${encodedFilename}` : `${base}/${encodedFilename}`
  }

  // Fallback to local /media path when no custom public CDN domain is configured
  // Note: R2 S3 endpoints (https://*.r2.cloudflarestorage.com) reject unauthenticated GET requests,
  // so we never output raw S3 API endpoints as browser-facing image URLs.
  return cleanPrefix ? `/media/${cleanPrefix}/${encodedFilename}` : `/media/${encodedFilename}`
}

/**
 * Returns safe diagnostic info about R2 configuration without leaking credentials
 */
export function getR2DiagnosticInfo() {
  const config = getR2Config()
  return {
    isConfigured: config.isConfigured,
    bucket: config.bucket,
    endpoint: config.endpoint ? config.endpoint.replace(/https:\/\/[^.]+\./, 'https://[REDACTED].') : 'not-set',
    region: config.region,
    hasAccessKey: Boolean(config.accessKeyId && !isPlaceholder(config.accessKeyId)),
    hasSecretKey: Boolean(config.secretAccessKey && !isPlaceholder(config.secretAccessKey)),
    accessKeyPreview: config.accessKeyId && !isPlaceholder(config.accessKeyId) ? `${config.accessKeyId.slice(0, 4)}...${config.accessKeyId.slice(-4)}` : 'missing',
    publicUrl: config.publicUrl || 'none (default path style)',
  }
}

