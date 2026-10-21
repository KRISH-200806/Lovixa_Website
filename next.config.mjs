import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const customR2Host = (() => {
  try {
    const raw = process.env.R2_PUBLIC_URL || process.env.S3_PUBLIC_URL
    if (raw && !raw.includes('your-') && !raw.includes('YOUR_')) {
      return new URL(raw).hostname
    }
  } catch {}
  return null
})()

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'media.lovixacosmetic.com',
      },
      {
        protocol: 'https',
        hostname: 'lovixacosmetic.com',
      },
      ...(customR2Host
        ? [
            {
              protocol: 'https',
              hostname: customR2Host,
            },
          ]
        : []),
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/terms',
        destination: '/terms-conditions',
        permanent: true,
      },
      {
        source: '/refund-policy',
        destination: '/return-refund-policy',
        permanent: true,
      },
      {
        source: '/our-story',
        destination: '/about',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
