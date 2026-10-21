'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Search, User, Menu, X, Heart, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cart/cart-store'
import { useWishlistStore } from '@/lib/wishlist/wishlist-store'
import { useAuth } from '@/components/providers/AuthProvider'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'

export function Header({
  storeName = 'LOVIXA COSMETIC',
}: {
  storeName?: string
}) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const { openCart, getTotalItems } = useCartStore()
  const { getTotalItems: getWishlistCount } = useWishlistStore()
  const { user, openAuthModal, logout } = useAuth()
  const { formatPrice } = useCurrency()
  const totalItems = getTotalItems()
  const wishlistCount = getWishlistCount()

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Quick live search matching
  const searchResults = searchQuery.trim()
    ? [
      {
        title: 'LOVIXA Shampoo',
        slug: 'lovixa-shampoo',
        price: 299,
        category: 'Everyday Cleansing',
        image: '/images/lovixa-shampoo.jpg',
      },
      {
        title: 'LOVIXA Hair Oil',
        slug: 'lovixa-hair-oil',
        price: 299,
        category: 'Hair Nourishment',
        image: '/images/lovixa-hairoil.jpg',
      },
      {
        title: 'LOVIXA Hair Care Duo',
        slug: 'lovixa-hair-care-duo',
        price: 549,
        category: 'Complete Ritual Duo',
        image: '/images/lovixa-duo.jpg',
      },
    ].filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : []

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
          ? 'bg-[#FBF6F8]/98 backdrop-blur-md shadow-xs border-b border-[#E8C4D4]/60 py-0'
          : 'bg-[#FBF6F8] border-b border-[#E8C4D4]/40 py-0.5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile & Tablet menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-[#2B1822] hover:text-[#6B2D5C] cursor-pointer shrink-0"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Luxury Brand Logo */}
          <Link href="/" className="flex flex-col justify-center shrink-0 py-1" aria-label="LOVIXA COSMETIC - Home">
            <div className="relative h-7 sm:h-9 md:h-10 w-28 sm:w-36 md:w-40">
              <Image
                src="/images/lovixa-logo.webp"
                alt="LOVIXA COSMETIC"
                fill
                priority
                className="object-contain object-left"
                sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
              />
            </div>
          </Link>

          {/* Desktop Navigation: Home | Shop All | Hair Care | Our Story | Contact Us */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 2xl:gap-8 text-xs font-bold tracking-wider uppercase text-[#2B1822] shrink-0">
            <Link href="/" prefetch={true} className="hover:text-[#6B2D5C] transition-colors whitespace-nowrap shrink-0">
              Home
            </Link>
            <Link href="/products" prefetch={true} className="hover:text-[#6B2D5C] transition-colors whitespace-nowrap shrink-0">
              Shop All
            </Link>
            <Link href="/#collection" className="hover:text-[#6B2D5C] transition-colors whitespace-nowrap shrink-0">
              Hair Care
            </Link>
            <Link href="/about" prefetch={true} className="hover:text-[#6B2D5C] transition-colors whitespace-nowrap shrink-0">
              Our Story
            </Link>
            <Link
              href="/contact"
              prefetch={true}
              className="hover:text-[#6B2D5C] transition-colors whitespace-nowrap shrink-0"
            >
              Contact Us
            </Link>
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* Live Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 sm:p-2 text-[#2B1822] hover:text-[#6B2D5C] rounded-full hover:bg-[#E8C4D4]/20 transition-colors cursor-pointer shrink-0"
              title="Search formulations"
              aria-label="Search formulations"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-1.5 sm:p-2 text-[#2B1822] hover:text-[#6B2D5C] rounded-full hover:bg-[#E8C4D4]/20 transition-colors shrink-0"
              title="My Wishlist"
              aria-label="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#6B2D5C] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-75 duration-200">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Menu */}
            {mounted && user ? (
              <div className="relative group shrink-0">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-1.5 pr-2 xl:pr-2.5 text-[#2B1822] hover:text-[#6B2D5C] rounded-full hover:bg-[#E8C4D4]/20 transition-colors border border-[#E8C4D4]/60 shrink-0 whitespace-nowrap"
                  title="My Account"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2B1822] text-[#E8C4D4] text-xs font-bold flex items-center justify-center shrink-0">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold max-w-[80px] truncate hidden xl:inline text-[#2B1822]">
                    {user.name?.split(' ')[0] || user.email.split('@')[0]}
                  </span>
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#FBF6F8] border border-[#E8C4D4]/70 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="px-4 py-2 border-b border-[#E8C4D4]/40">
                    <p className="text-xs font-bold text-[#2B1822] truncate">{user.name || 'Customer'}</p>
                    <p className="text-[11px] text-[#6A5A63] truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-xs text-[#2B1822] hover:bg-[#E8C4D4]/25 hover:text-[#6B2D5C] font-medium"
                  >
                    Account Dashboard
                  </Link>
                  <Link
                    href="/account?tab=orders"
                    className="block px-4 py-2 text-xs text-[#2B1822] hover:bg-[#E8C4D4]/25 hover:text-[#6B2D5C] font-medium"
                  >
                    My Orders &amp; Receipts
                  </Link>
                  <Link
                    href="/account?tab=wishlist"
                    className="block px-4 py-2 text-xs text-[#2B1822] hover:bg-[#E8C4D4]/25 hover:text-[#6B2D5C] font-medium"
                  >
                    Saved Wishlist
                  </Link>
                  <div className="border-t border-[#E8C4D4]/40 my-1"></div>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 text-xs text-[#6B2D5C] hover:bg-[#E8C4D4]/25 font-medium cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 py-1.5 px-2.5 xl:px-3 rounded-full text-xs font-semibold bg-[#FBF6F8] hover:bg-[#E8C4D4]/30 text-[#2B1822] border border-[#E8C4D4]/70 transition cursor-pointer whitespace-nowrap shrink-0"
                title="Sign In"
              >
                <User className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                <span className="hidden xl:inline whitespace-nowrap">Sign In</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#2B1822] hover:text-[#6B2D5C] rounded-full hover:bg-[#E8C4D4]/20 transition-colors cursor-pointer shrink-0"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-[#6B2D5C] text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-75 duration-200">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8C4D4]/60 bg-[#FBF6F8] px-4 sm:px-6 md:px-8 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-[#2B1822] hover:text-[#6B2D5C]"
            >
              Home
            </Link>
            <Link
              href="/products"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#2B1822] hover:text-[#6B2D5C]"
            >
              Shop All
            </Link>
            <Link
              href="/#collection"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#2B1822] hover:text-[#6B2D5C]"
            >
              Hair Care
            </Link>
            <Link
              href="/about"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#2B1822] hover:text-[#6B2D5C]"
            >
              Our Story
            </Link>
            <Link
              href="/contact"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-[#6B2D5C]"
            >
              Contact Us
            </Link>
            {mounted && user ? (
              <div className="pt-2 border-t border-[#E8C4D4]/50 space-y-2">
                <div className="text-xs text-[#2B1822]/60 font-semibold">Signed in as {user.email}</div>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-[#2B1822]"
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    logout()
                  }}
                  className="block text-sm font-medium text-[#6B2D5C]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-[#E8C4D4]/50">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    openAuthModal('login')
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-[#6B2D5C] hover:bg-[#562349] text-white"
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Live Search Drawer / Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-start bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
          onClick={() => {
            setSearchOpen(false)
            setSearchQuery('')
          }}
        >
          <div
            className="w-full bg-[#FBF6F8] border-b border-[#E8C4D4]/70 shadow-xl px-4 py-5 sm:p-6 md:p-8 select-text"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
              {/* Top Bar with Input & Close */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#6A5A63] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search botanical shampoo, hair oil, hair ritual..."
                    className="w-full pl-11 pr-12 py-3 sm:py-3.5 bg-white rounded-full border border-[#E8C4D4]/80 text-sm sm:text-base text-[#2B1822] placeholder:text-[#6A5A63] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6B2D5C]/20 focus:border-[#6B2D5C] transition-all font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6A5A63] hover:text-[#6B2D5C] cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="p-2 sm:p-2.5 text-[#2B1822]/60 hover:text-[#2B1822] rounded-full hover:bg-[#E8C4D4]/25 transition-colors cursor-pointer shrink-0"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-[#6A5A63]">
                <span className="font-bold text-[#6B2D5C] uppercase tracking-wider text-[10px] sm:text-[11px] font-sans">
                  Quick Search:
                </span>
                {['LOVIXA Shampoo', 'LOVIXA Hair Oil', 'Hair Care Duo', 'All Products'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (tag === 'All Products') {
                        setSearchOpen(false)
                        router.push('/products')
                      } else {
                        setSearchQuery(tag)
                      }
                    }}
                    className="px-3 py-1 rounded-full bg-white hover:bg-[#E8C4D4]/30 hover:text-[#6B2D5C] border border-[#E8C4D4]/70 text-[#2B1822] text-xs font-medium transition-colors cursor-pointer font-sans"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Results or Recommendations */}
              <div className="pt-2 border-t border-[#E8C4D4]/60">
                {searchQuery.trim() ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6A5A63] font-sans">
                        {searchResults.length} result{searchResults.length === 1 ? '' : 's'} found
                      </p>
                      <Link
                        href={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setSearchOpen(false)}
                        className="text-xs font-bold text-[#6B2D5C] hover:underline flex items-center gap-1 font-sans"
                      >
                        View in catalog <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                        {searchResults.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/products/${item.slug}`}
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-[#E8C4D4]/20 border border-[#E8C4D4]/60 hover:border-[#6B2D5C]/40 transition-all group"
                          >
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FBF6F8] shrink-0 border border-[#E8C4D4]/60">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B2D5C] font-sans">
                                {item.category}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-[#2B1822] truncate group-hover:text-[#6B2D5C] transition-colors font-sans">
                                {item.title}
                              </h4>
                              <p className="text-xs font-bold text-[#2B1822] mt-0.5 font-sans">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-[#6A5A63] font-medium font-sans">
                          No products matched &ldquo;{searchQuery}&rdquo;.
                        </p>
                        <Link
                          href="/products"
                          onClick={() => setSearchOpen(false)}
                          className="inline-block mt-2.5 text-xs font-bold text-[#6B2D5C] hover:underline font-sans"
                        >
                          Explore all hair care products →
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6A5A63] mb-2.5 font-sans">
                      Featured Hair Care Essentials
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          title: 'LOVIXA Shampoo',
                          slug: 'lovixa-shampoo',
                          price: 299,
                          category: 'Everyday Cleansing',
                          image: '/images/lovixa-shampoo.jpg',
                        },
                        {
                          title: 'LOVIXA Hair Oil',
                          slug: 'lovixa-hair-oil',
                          price: 299,
                          category: 'Hair Nourishment',
                          image: '/images/lovixa-hairoil.jpg',
                        },
                        {
                          title: 'LOVIXA Hair Care Duo',
                          slug: 'lovixa-hair-care-duo',
                          price: 549,
                          category: 'Complete Ritual Duo',
                          image: '/images/lovixa-duo.jpg',
                        },
                      ].map((item) => (
                        <Link
                          key={item.slug}
                          href={`/products/${item.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white hover:bg-[#E8C4D4]/20 border border-[#E8C4D4]/60 hover:border-[#6B2D5C]/40 transition-all group"
                        >
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FBF6F8] shrink-0 border border-[#E8C4D4]/60">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-[#6B2D5C] uppercase tracking-wider font-sans">
                              {item.category}
                            </span>
                            <h4 className="text-xs font-bold text-[#2B1822] truncate group-hover:text-[#6B2D5C] transition-colors font-sans">
                              {item.title}
                            </h4>
                            <p className="text-xs font-bold text-[#2B1822] mt-0.5 font-sans">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Click outside to dismiss */}
          <div
            className="flex-1 cursor-pointer"
            onClick={() => {
              setSearchOpen(false)
              setSearchQuery('')
            }}
          />
        </div>
      )}
    </>
  )
}
