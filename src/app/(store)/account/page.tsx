'use client'

import { useState, useEffect } from 'react'
import {
  Package,
  MapPin,
  Heart,
  ArrowUpRight,
  ShoppingBag,
  Trash2,
  Printer,
  X,
  CheckCircle2,
  Clock,
  Truck,
  Loader2,
  ExternalLink,
  AlertCircle,
  RotateCcw,
  LogOut,
  User,
} from 'lucide-react'
import { useCurrency } from '@/components/providers/StoreSettingsProvider'
import { useWishlistStore } from '@/lib/wishlist/wishlist-store'
import { useCartStore } from '@/lib/cart/cart-store'
import { useAuth } from '@/components/providers/AuthProvider'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'

interface OrderItem {
  productId: string
  variantId?: string
  title: string
  sku?: string
  price: number
  quantity: number
  image?: string
  optionsSummary?: string
}

interface OrderRecord {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  date: string
  createdAt: string
  total: number
  grandTotal: number
  subtotal: number
  discountTotal: number
  couponCode?: string
  shippingTotal: number
  taxTotal: number
  currency: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | string
  paymentProvider: string
  paymentIntentId?: string
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | string
  trackingNumber?: string
  trackingUrl?: string
  itemsCount: number
  title: string
  items: OrderItem[]
  shippingAddress?: {
    firstName?: string
    lastName?: string
    address?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

export default function CustomerAccountPage() {
  const { formatPrice } = useCurrency()
  const { user, isLoading: isAuthLoading, isAuthenticated, openAuthModal, logout } = useAuth()
  const { items: wishlistItems, removeItem: removeWishlistItem, clearWishlist } = useWishlistStore()
  const { addItem, openCart } = useCartStore()

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders')
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<OrderRecord | null>(null)

  // Load URL tab param if provided
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab === 'wishlist' || tab === 'addresses' || tab === 'orders') {
        setActiveTab(tab)
      }
    }
  }, [])

  // Fetch real orders & profile data from database when user is authenticated
  useEffect(() => {
    let isMounted = true

    async function fetchOrders() {
      if (!user) {
        setIsLoadingOrders(false)
        return
      }

      setIsLoadingOrders(true)
      try {
        const queryUrl = `/api/orders?email=${encodeURIComponent(user.email)}`
        const res = await fetch(queryUrl)
        if (res.ok) {
          const data = await res.json()
          if (isMounted && Array.isArray(data.orders)) {
            setOrders(data.orders)
          }
        }
      } catch (err) {
        console.error('Failed to load customer orders:', err)
      } finally {
        if (isMounted) setIsLoadingOrders(false)
      }
    }

    if (!isAuthLoading) {
      fetchOrders()
    }

    return () => {
      isMounted = false
    }
  }, [user, isAuthLoading])

  const getInitials = (name: string) => {
    if (!name) return 'CU'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  // Admin Fulfillment Status Badge
  const getFulfillmentBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#6B2D5C] bg-[#6B2D5C]/10 border border-[#E8C4D4]/60 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#6B2D5C]" />
            Delivered
          </span>
        )
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#6B2D5C] bg-[#FBF6F8] border border-[#E8C4D4] px-2.5 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5 text-[#6B2D5C]" />
            Shipped / In Transit
          </span>
        )
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#6B2D5C] bg-[#FBF6F8] border border-[#E8C4D4] px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#6B2D5C] animate-pulse" />
            Processing Order
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        )
      case 'unfulfilled':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2B1822] bg-[#FBF6F8] border border-[#E8C4D4]/60 px-2.5 py-1 rounded-full">
            <Package className="w-3.5 h-3.5 text-[#6B2D5C]" />
            Order Placed
          </span>
        )
    }
  }

  // Admin Payment Status Badge
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6B2D5C] bg-[#6B2D5C]/10 border border-[#E8C4D4]/50 px-2 py-0.5 rounded-md">
            Paid
          </span>
        )
      case 'verification_pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
            Verification Pending
          </span>
        )
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            Awaiting Payment
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6B2D5C] bg-[#FBF6F8] border border-[#E8C4D4] px-2 py-0.5 rounded-md">
            <RotateCcw className="w-3 h-3" />
            Refunded
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
            Payment Failed
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            Payment Pending
          </span>
        )
    }
  }

  // Order Timeline Step Index
  const getFulfillmentStep = (status: string) => {
    if (status === 'delivered') return 4
    if (status === 'shipped') return 3
    if (status === 'processing') return 2
    if (status === 'cancelled') return -1
    return 1 // unfulfilled / order placed
  }

  // If Auth loading
  if (isAuthLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-white">
        <Loader2 className="w-8 h-8 text-[#6B2D5C] animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#2B1822]/60 font-medium">Loading your customer account...</p>
      </div>
    )
  }

  // If Not Authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white min-h-[75vh]">
        <PageHeaderBanner
          breadcrumbs={[
            { label: 'Customer Account' }
          ]}
          badge="LOVIXA PORTAL"
          title="Customer Account,"
          highlightTitle="Sign In to Continue"
          subtitle="Access your order history, carrier tracking, itemized receipts, and saved addresses."
          imageSrc="/images/lovixa-story.jpg"
          imageAlt="LOVIXA Customer Account"
          priority
        />
        <div className="max-w-lg mx-auto py-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#FBF6F8] flex items-center justify-center mx-auto text-[#6B2D5C] shadow-sm border border-[#E8C4D4]/60">
            <User className="w-8 h-8 text-[#6B2D5C]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#2B1822] tracking-tight">Sign In to Your Account</h2>
            <p className="text-xs text-[#2B1822]/70 leading-relaxed max-w-sm mx-auto">
              Please sign in or register to access your order history, carrier tracking, itemized receipts, and saved addresses.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-7 py-3 bg-[#6B2D5C] text-white rounded-full text-xs font-bold hover:bg-[#562349] transition shadow-md cursor-pointer"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-7 py-3 bg-white border border-[#E8C4D4]/70 text-[#2B1822] rounded-full text-xs font-bold hover:bg-[#FBF6F8] transition cursor-pointer"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white">
      <PageHeaderBanner
        breadcrumbs={[
          { label: 'Customer Account' }
        ]}
        badge="WELCOME BACK"
        title={`Hello, ${user.name || 'Valued Customer'},`}
        highlightTitle="Manage Orders & Account"
        subtitle="Track your shipments in real-time, view GST invoices, and manage saved shipping addresses."
        imageSrc="/images/lovixa-story.jpg"
        imageAlt="LOVIXA Customer Account"
        priority
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <div className="p-4 bg-[#FBF6F8] border border-[#E8C4D4]/60 rounded-2xl mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2B1822] text-[#E8C4D4] flex items-center justify-center font-bold text-sm shrink-0">
              {getInitials(user.name || user.email)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-[#2B1822] truncate">{user.name || 'Customer'}</h3>
              <p className="text-[11px] text-[#2B1822]/60 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#6B2D5C] text-white shadow-sm'
                : 'text-[#2B1822]/70 hover:bg-[#FBF6F8] hover:text-[#2B1822]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Orders & Tracking</span>
            </div>
            {orders.length > 0 && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#E8C4D4]/50 text-[#2B1822]'
                }`}
              >
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-[#6B2D5C] text-white shadow-sm'
                : 'text-[#2B1822]/70 hover:bg-[#FBF6F8] hover:text-[#2B1822]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-[#6B2D5C] text-white shadow-sm'
                : 'text-[#2B1822]/70 hover:bg-[#FBF6F8] hover:text-[#2B1822]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4" />
              <span>My Wishlist</span>
            </div>
            {wishlistItems.length > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-[#E8C4D4]/50 text-[#6B2D5C]'
                }`}
              >
                {wishlistItems.length}
              </span>
            )}
          </button>

          <div className="pt-4 border-t border-[#E8C4D4]/40">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white border border-[#E8C4D4]/50 rounded-3xl p-6 sm:p-8 min-h-[400px]">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#2B1822]">Your Orders & Invoices</h2>
                  <p className="text-xs text-[#2B1822]/60 mt-0.5">
                    Real-time status updates, carrier tracking, and itemized receipts
                  </p>
                </div>
                <span className="text-xs text-[#2B1822]/60 font-medium">
                  Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>

              {isLoadingOrders ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-[#6B2D5C] animate-spin mx-auto" />
                  <p className="text-xs text-[#2B1822]/60 font-medium">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center space-y-4 bg-[#FBF6F8] rounded-2xl border border-[#E8C4D4]/50">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm border border-[#E8C4D4]/50 text-[#6B2D5C]">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B1822]">No Orders Found</h3>
                    <p className="text-xs text-[#2B1822]/60 max-w-sm mx-auto mt-1">
                      You haven&apos;t placed any orders with this account yet. When you complete checkout, your real orders and downloadable receipts will appear right here.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/products"
                      className="inline-block px-6 py-2.5 bg-[#6B2D5C] text-white text-xs font-bold rounded-full hover:bg-[#562349] transition-all shadow-sm"
                    >
                      Browse Products
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const currentStep = getFulfillmentStep(order.fulfillmentStatus)

                    return (
                      <div
                        key={order.id}
                        className="p-5 sm:p-6 border border-[#E8C4D4]/60 rounded-2xl hover:border-[#6B2D5C]/50 transition-all bg-white shadow-xs space-y-5"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8C4D4]/40">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-extrabold text-[#2B1822] font-mono">
                                #{order.orderNumber}
                              </span>
                              {getFulfillmentBadge(order.fulfillmentStatus)}
                              {getPaymentBadge(order.paymentStatus)}
                            </div>
                            <p className="text-[11px] text-[#2B1822]/50">Placed on {order.date}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] uppercase font-bold text-[#2B1822]/50 block">
                                Total
                              </span>
                              <span className="text-sm font-extrabold text-[#2B1822]">
                                {formatCurrency(order.grandTotal || order.total, order.currency)}
                              </span>
                            </div>

                            <button
                              onClick={() => setSelectedInvoice(order)}
                              className="px-5 py-2 text-xs font-semibold bg-[#6B2D5C] hover:bg-[#562349] text-white rounded-full transition-colors flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                            >
                              <span>View Receipt</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Fulfillment Progress Bar */}
                        {order.fulfillmentStatus !== 'cancelled' ? (
                          <div className="py-1">
                            <div className="grid grid-cols-4 gap-2 text-center">
                              {[
                                { step: 1, label: 'Placed' },
                                { step: 2, label: 'Processing' },
                                { step: 3, label: 'Shipped' },
                                { step: 4, label: 'Delivered' },
                              ].map((s) => (
                                <div key={s.step} className="space-y-1.5">
                                  <div
                                    className={`h-1.5 rounded-full transition-all ${
                                      currentStep >= s.step
                                        ? 'bg-[#6B2D5C]'
                                        : 'bg-[#E8C4D4]/40'
                                    }`}
                                  />
                                  <span
                                    className={`text-[10px] font-semibold block ${
                                      currentStep >= s.step ? 'text-[#2B1822]' : 'text-[#2B1822]/40'
                                    }`}
                                  >
                                    {s.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>This order was marked as cancelled by admin.</span>
                          </div>
                        )}

                        {/* Carrier Tracking Badge if set by admin */}
                        {order.trackingNumber && (
                          <div className="p-3 bg-[#FBF6F8] border border-[#E8C4D4]/60 rounded-xl flex items-center justify-between text-xs text-[#2B1822]">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-[#6B2D5C]" />
                              <span>
                                Tracking #: <strong>{order.trackingNumber}</strong>
                              </span>
                            </div>
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-[#6B2D5C] hover:text-[#562349] hover:underline"
                              >
                                <span>Track Package</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Items list preview */}
                        <div className="space-y-2 pt-1">
                          {order.items && order.items.length > 0 ? (
                            <div className="divide-y divide-[#E8C4D4]/30">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-[#FBF6F8] border border-[#E8C4D4]/50 overflow-hidden shrink-0 flex items-center justify-center text-[#2B1822]/40">
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            ;(e.currentTarget as HTMLElement).style.display = 'none'
                                          }}
                                        />
                                      ) : (
                                        <Package className="w-4 h-4" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-[#2B1822] truncate">{item.title}</p>
                                      {item.optionsSummary && (
                                        <p className="text-[11px] text-[#2B1822]/60">{item.optionsSummary}</p>
                                      )}
                                      <p className="text-[11px] text-[#2B1822]/40">Qty: {item.quantity}</p>
                                    </div>
                                  </div>

                                  <span className="font-bold text-[#2B1822] shrink-0">
                                    {formatCurrency(item.price * item.quantity, order.currency)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-[#2B1822]/70">{order.title}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#2B1822]">Saved Addresses</h2>
                <p className="text-xs text-[#2B1822]/60 mt-0.5">
                  Shipping and billing addresses saved to your customer profile
                </p>
              </div>

              {user.savedAddresses && user.savedAddresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.savedAddresses.map((addr, idx) => (
                    <div key={idx} className="p-5 border border-[#E8C4D4]/60 rounded-2xl space-y-2 bg-white shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2B1822]">{addr.label || 'Saved Address'}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-[#6B2D5C] bg-[#6B2D5C]/10 border border-[#E8C4D4]/60 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#2B1822]/70 leading-relaxed">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        <br />
                        {addr.city}, {addr.state} {addr.postalCode}
                        <br />
                        {addr.country}
                      </p>
                    </div>
                  ))}
                </div>
              ) : orders.length > 0 && orders[0].shippingAddress ? (
                <div className="p-5 border border-[#E8C4D4]/60 rounded-2xl max-w-md space-y-3 bg-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B1822]">Recent Shipping Address</span>
                    <span className="text-[10px] font-bold text-[#6B2D5C] bg-[#6B2D5C]/10 border border-[#E8C4D4]/60 px-2 py-0.5 rounded-full">
                      From Order
                    </span>
                  </div>
                  <p className="text-xs text-[#2B1822]/70 leading-relaxed">
                    <strong>
                      {orders[0].shippingAddress.firstName} {orders[0].shippingAddress.lastName}
                    </strong>
                    <br />
                    {orders[0].shippingAddress.address}
                    <br />
                    {orders[0].shippingAddress.city}, {orders[0].shippingAddress.state} {orders[0].shippingAddress.postalCode}
                    <br />
                    {orders[0].shippingAddress.country}
                  </p>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 bg-[#FBF6F8] rounded-2xl border border-[#E8C4D4]/50 max-w-md">
                  <MapPin className="w-8 h-8 text-[#6B2D5C] mx-auto" />
                  <p className="text-xs text-[#2B1822] font-semibold">No saved addresses</p>
                  <p className="text-[11px] text-[#2B1822]/60 max-w-xs mx-auto">
                    When you place an order with your shipping address, it will be automatically saved here for quick checkout.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#2B1822]">
                    Saved to Wishlist ({wishlistItems.length})
                  </h2>
                  <p className="text-xs text-[#2B1822]/60 mt-0.5">
                    Items you have saved for later purchase
                  </p>
                </div>
                {wishlistItems.length > 0 && (
                  <button
                    onClick={clearWishlist}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {wishlistItems.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#FBF6F8] rounded-2xl border border-[#E8C4D4]/50">
                  <div className="w-12 h-12 rounded-full bg-white text-[#6B2D5C] border border-[#E8C4D4]/50 mx-auto flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-[#2B1822]">Your wishlist is empty</p>
                  <p className="text-xs text-[#2B1822]/60 max-w-sm mx-auto">
                    Click the heart icon on any product card or detail page to save it here for later.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/products"
                      className="inline-block px-6 py-2.5 bg-[#6B2D5C] text-white text-xs font-bold rounded-full hover:bg-[#562349] transition-all shadow-sm"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.productId}
                      className="border border-[#E8C4D4]/60 rounded-2xl p-3 flex flex-col justify-between hover:border-[#6B2D5C]/50 hover:shadow-md transition-all group bg-white"
                    >
                      <div>
                        <div className="relative aspect-square w-full bg-[#FBF6F8] rounded-xl overflow-hidden mb-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#2B1822]/40 font-bold">
                              {item.title.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <button
                            onClick={() => removeWishlistItem(item.productId)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-50 text-[#2B1822]/60 hover:text-rose-600 rounded-full transition-colors shadow-sm cursor-pointer"
                            title="Remove from Wishlist"
                            aria-label="Remove from Wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <Link
                          href={`/products/${item.slug}`}
                          className="text-xs font-bold text-[#2B1822] hover:text-[#6B2D5C] transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        {item.brand && <p className="text-[11px] text-[#2B1822]/50">{item.brand}</p>}
                        <p className="text-xs font-extrabold text-[#2B1822] mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          addItem({
                            productId: item.productId,
                            title: item.title,
                            slug: item.slug || '',
                            price: item.price,
                            compareAtPrice: item.compareAtPrice,
                            image: item.image,
                            quantity: 1,
                          })
                          openCart()
                        }}
                        className="mt-3 w-full py-2.5 bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B1822]/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#E8C4D4]/60 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8C4D4]/40">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#6B2D5C] tracking-wider">
                  Official Order Receipt
                </span>
                <h3 className="text-lg font-black text-[#2B1822] font-mono">
                  #{selectedInvoice.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 text-[#2B1822]/40 hover:text-[#2B1822] rounded-full hover:bg-[#FBF6F8] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Badges Header */}
            <div className="flex items-center justify-between p-4 bg-[#FBF6F8] border border-[#E8C4D4]/40 rounded-2xl gap-3 flex-wrap">
              <div className="space-y-0.5">
                <span className="text-[#2B1822]/50 text-[10px] uppercase font-bold block">
                  Fulfillment Status
                </span>
                <div>{getFulfillmentBadge(selectedInvoice.fulfillmentStatus)}</div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#2B1822]/50 text-[10px] uppercase font-bold block">
                  Payment Status
                </span>
                <div>{getPaymentBadge(selectedInvoice.paymentStatus)}</div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#2B1822]/50 text-[10px] uppercase font-bold block">
                  Payment Method
                </span>
                <span className="text-xs font-bold text-[#2B1822] uppercase">
                  {selectedInvoice.paymentProvider}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[#2B1822]/50 text-[10px] uppercase font-bold block">Date</span>
                <span className="text-xs font-bold text-[#2B1822]">{selectedInvoice.date}</span>
              </div>
            </div>

            {/* Carrier Tracking Box if set */}
            {selectedInvoice.trackingNumber && (
              <div className="p-3.5 bg-[#FBF6F8] border border-[#E8C4D4]/60 rounded-2xl flex items-center justify-between text-xs text-[#2B1822]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#6B2D5C]" />
                  <span>
                    Carrier Tracking #: <strong>{selectedInvoice.trackingNumber}</strong>
                  </span>
                </div>
                {selectedInvoice.trackingUrl && (
                  <a
                    href={selectedInvoice.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#6B2D5C] hover:text-[#562349] hover:underline"
                  >
                    <span>Track Live</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Customer & Shipping Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 border border-[#E8C4D4]/50 rounded-2xl bg-white space-y-1.5">
                <span className="text-[#2B1822]/50 text-[10px] uppercase font-bold block">
                  Customer Info
                </span>
                <p className="font-bold text-[#2B1822]">{selectedInvoice.customerName}</p>
                <p className="text-[#2B1822]/70">{selectedInvoice.customerEmail}</p>
                {selectedInvoice.customerPhone && (
                  <p className="text-[#2B1822]/60">{selectedInvoice.customerPhone}</p>
                )}
              </div>

              <div className="p-4 border border-[#E8C4D4]/50 rounded-2xl bg-white space-y-1.5">
                <span className="text-[#2B1822]/50 text-[10px] uppercase font-bold block">
                  Delivery Address
                </span>
                {selectedInvoice.shippingAddress ? (
                  <p className="text-[#2B1822]/70 leading-relaxed">
                    {selectedInvoice.shippingAddress.address || ''}
                    <br />
                    {selectedInvoice.shippingAddress.city}
                    {selectedInvoice.shippingAddress.state
                      ? `, ${selectedInvoice.shippingAddress.state}`
                      : ''}{' '}
                    {selectedInvoice.shippingAddress.postalCode || ''}
                    {selectedInvoice.shippingAddress.country
                      ? `, ${selectedInvoice.shippingAddress.country}`
                      : ''}
                  </p>
                ) : (
                  <p className="text-[#2B1822]/40">Standard Delivery</p>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B1822]/60">
                Purchased Items ({selectedInvoice.itemsCount})
              </h4>
              <div className="border border-[#E8C4D4]/50 rounded-2xl overflow-hidden divide-y divide-[#E8C4D4]/30 text-xs bg-white">
                {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                  selectedInvoice.items.map((item, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#FBF6F8] border border-[#E8C4D4]/50 overflow-hidden shrink-0 flex items-center justify-center text-[#2B1822]/40">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.currentTarget as HTMLElement).style.display = 'none'
                              }}
                            />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#2B1822] truncate">{item.title}</p>
                          {item.optionsSummary && (
                            <p className="text-[11px] text-[#2B1822]/60">{item.optionsSummary}</p>
                          )}
                          <p className="text-[11px] text-[#2B1822]/40">
                            Qty: {item.quantity} × {formatCurrency(item.price, selectedInvoice.currency)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#2B1822] shrink-0">
                        {formatCurrency(item.price * item.quantity, selectedInvoice.currency)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-[#2B1822]/60 text-center">No item details available</div>
                )}
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-4 bg-[#FBF6F8] border border-[#E8C4D4]/40 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-[#2B1822]/70">
                <span>Subtotal</span>
                <span>{formatCurrency(selectedInvoice.subtotal || selectedInvoice.total, selectedInvoice.currency)}</span>
              </div>
              {selectedInvoice.discountTotal > 0 && (
                <div className="flex justify-between text-[#6B2D5C] font-medium">
                  <span>
                    Discount Applied {selectedInvoice.couponCode ? `(${selectedInvoice.couponCode})` : ''}
                  </span>
                  <span>-{formatCurrency(selectedInvoice.discountTotal, selectedInvoice.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#2B1822]/70">
                <span>Shipping</span>
                <span>
                  {selectedInvoice.shippingTotal > 0
                    ? formatCurrency(selectedInvoice.shippingTotal, selectedInvoice.currency)
                    : 'Free'}
                </span>
              </div>
              <div className="flex justify-between text-[#2B1822]/70">
                <span>Estimated Tax (GST/VAT)</span>
                <span>{formatCurrency(selectedInvoice.taxTotal || 0, selectedInvoice.currency)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#2B1822] pt-2 border-t border-[#E8C4D4]/40">
                <span>Grand Total</span>
                <span>{formatCurrency(selectedInvoice.grandTotal || selectedInvoice.total, selectedInvoice.currency)}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-white border border-[#E8C4D4]/60 hover:bg-[#FBF6F8] text-[#2B1822] text-xs font-semibold rounded-full flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#6B2D5C]" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-6 py-2.5 bg-[#6B2D5C] hover:bg-[#562349] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
