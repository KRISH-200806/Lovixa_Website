import React from 'react'
import { Anton, DM_Sans, Playfair_Display } from 'next/font/google'
import './styles.css'
import { getHeaderFooterForLayout } from '@/lib/cms/queries'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, THEME_COLOR } from '@/lib/seo-constants'
import { JsonLd, organizationSchema, websiteSchema } from '@/lib/seo/jsonld'
import { getMediaUrl } from '@/utils/getMediaUrl'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity'
import MetaPixel from '@/components/analytics/MetaPixel'
import CookieConsent from '@/components/analytics/CookieConsent'
import ThemeStyle from '@/components/ui/ThemeStyle'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/cart/CartDrawer'

// Lovixa Official Brand Typography:
// 1. Anton (Headlines)
// 2. DM Sans (Body & Buttons)
// 3. Playfair Display Italic (Accent Lines & Editorial Subheads)
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  // Placeholder favicon ships by default — swap public/favicon.ico + icon.svg
  // per project. See starter-kit/26-default-branding.md.
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
  },
}

export const viewport = {
  themeColor: THEME_COLOR,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { headerData, footerData, themeSettings } = await getHeaderFooterForLayout()
  const mode = 'light'

  return (
    <html
      lang="en"
      data-theme={mode}
      className={`${anton.variable} ${dmSans.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runtime CSS vars for both modes, admin-editable — see starter-kit/22-theme-management.md */}
        <ThemeStyle themeSettings={themeSettings} />
      </head>
      <body suppressHydrationWarning>
        {/* Site-wide GEO/AEO structured data — page-level JSON-LD (FAQPage, Article,
            BreadcrumbList) is added per-page, not here. See lib/seo/jsonld.tsx. */}
        <JsonLd
          data={[
            organizationSchema({ logoPath: getMediaUrl(headerData?.logo) || undefined }),
            websiteSchema(),
          ]}
        />
        <CartProvider>
          <Navbar data={headerData} />
          {children}
          <Footer data={footerData} />
          <CartDrawer />
        </CartProvider>
        {/* No-op unless NEXT_PUBLIC_GA_MEASUREMENT_ID / NEXT_PUBLIC_CLARITY_PROJECT_ID / NEXT_PUBLIC_META_PIXEL_ID are set. */}
        <GoogleAnalytics />
        <MicrosoftClarity />
        <MetaPixel />
        <CookieConsent />
      </body>
    </html>
  )
}
