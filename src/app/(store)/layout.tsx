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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lovixacosmetic.com'),
  title: 'LOVIXA COSMETIC | Embrace Your Natural Beauty • Everyday Hair Care Essentials',
  description:
    "Discover LOVIXA's hair care essentials, created to bring simplicity, nourishment and a touch of luxury to your everyday routine. Shampoo & Hair Oil.",
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
    title: 'LOVIXA COSMETIC | Everyday Hair Care Essentials',
    description: 'Embrace Your Natural Beauty with LOVIXA Botanical & Ayurvedic Hair Care.',
    url: 'https://lovixacosmetic.com',
    siteName: 'LOVIXA COSMETIC',
    images: [
      {
        url: 'https://lovixacosmetic.com/images/lovixa-logo.png',
        width: 600,
        height: 164,
        alt: 'LOVIXA COSMETIC Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOVIXA COSMETIC',
    description: 'Everyday Hair Care Essentials - Shampoo & Hair Oil',
    images: ['https://lovixacosmetic.com/images/lovixa-logo.png'],
  },
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${outfit.className} min-h-screen flex flex-col bg-[#FBF6F8] text-[#2B1822] antialiased selection:bg-[#6B2D5C] selection:text-white`}
      >
        <AuthProvider>
          <StoreSettingsProvider>
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
