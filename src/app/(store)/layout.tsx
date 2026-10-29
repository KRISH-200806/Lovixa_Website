import type { Metadata } from 'next'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { StoreSettingsProvider } from '@/components/providers/StoreSettingsProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { AuthModal } from '@/components/auth/AuthModal'
import { QuickViewModal } from '@/components/products/QuickViewModal'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { Outfit } from 'next/font/google'
import '../globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lovixacosmetic.com'),
  title: {
    default: 'LOVIXA COSMETIC | Embrace Your Natural Beauty • Botanical Hair Care',
    template: '%s | LOVIXA COSMETIC',
  },
  description:
    'Discover LOVIXA Botanical Hair Care Essentials — Refreshing Botanical Shampoo (200ml) & Nourishing Hair Oil (100ml). Thoughtfully formulated with Rosemary, Eucalyptus & Cold-Pressed oils for healthier, radiant hair.',
  keywords: [
    'LOVIXA',
    'LOVIXA COSMETIC',
    'botanical shampoo',
    'nourishing hair oil',
    'hair care combo',
    'rosemary scalp care',
    'paraben free hair care',
    'sulfate free shampoo',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'LOVIXA COSMETIC | Embrace Your Natural Beauty • Botanical Hair Care',
    description:
      'Discover LOVIXA Botanical Hair Care Essentials — Refreshing Botanical Shampoo (200ml) & Nourishing Hair Oil (100ml). Thoughtfully formulated with Rosemary, Eucalyptus & Cold-Pressed oils for healthier, radiant hair.',
    url: 'https://www.lovixacosmetic.com',
    siteName: 'LOVIXA COSMETIC',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.lovixacosmetic.com/images/lovixa-og.jpg',
        secureUrl: 'https://www.lovixacosmetic.com/images/lovixa-og.jpg',
        width: 1200,
        height: 630,
        alt: 'LOVIXA COSMETIC Botanical Hair Care Essentials',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOVIXA COSMETIC | Embrace Your Natural Beauty • Botanical Hair Care',
    description:
      'Discover LOVIXA Botanical Hair Care Essentials — Refreshing Botanical Shampoo (200ml) & Nourishing Hair Oil (100ml).',
    images: ['https://www.lovixacosmetic.com/images/lovixa-og.jpg'],
  },
}

import Script from 'next/script'
import { getStorefrontSEOSettings } from '@/lib/cms/products'
import { getStoreSettings } from '@/lib/cms/queries'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [seo, storeSettings] = await Promise.all([
    getStorefrontSEOSettings(),
    getStoreSettings(),
  ])

  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${outfit.className} min-h-screen flex flex-col bg-[#FBF6F8] text-[#2B1822] antialiased selection:bg-[#6B2D5C] selection:text-white`}
      >
        {/* Dynamic Google Analytics (GA4) */}
        {seo.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${seo.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Dynamic Meta Pixel */}
        {seo.metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${seo.metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        <AuthProvider>
          <StoreSettingsProvider initialSettings={storeSettings as any}>
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <AuthModal />
            <QuickViewModal />
            <WhatsAppButton />
          </StoreSettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
