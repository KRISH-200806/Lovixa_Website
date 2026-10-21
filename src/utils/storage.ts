// One isXConfigured() guard per storage-adapter package this kit knows about
// (src/payload.config.ts wires exactly one of these, chosen at setup.sh time —
// see 11-environment-and-deployment.md). Same defensive shape as the
// analytics components: never construct an adapter with an empty-string
// credential, only treat a provider as "on" once every var it needs is set.

export const isS3Configured = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_REGION &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
)

export const isAzureConfigured = Boolean(
  process.env.AZURE_STORAGE_CONNECTION_STRING &&
    process.env.AZURE_STORAGE_CONTAINER_NAME &&
    process.env.AZURE_STORAGE_BASE_URL,
)

export const isGcsConfigured = Boolean(process.env.GCS_BUCKET && process.env.GCS_PROJECT_ID)

export const isVercelBlobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

export const isUploadthingConfigured = Boolean(process.env.UPLOADTHING_TOKEN)
