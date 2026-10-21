'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart/cart-store'
import { useCurrency, useStoreSettings } from '@/components/providers/StoreSettingsProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  ShieldCheck,
  CheckCircle2,
  Loader2,
  UserCheck,
  AlertCircle,
  Truck,
  ArrowLeft,
  ChevronDown,
  Info,
} from 'lucide-react'
import {
  INDIAN_STATES,
  validateIndianMobile,
  validateIndianPincode,
} from '@/lib/whatsapp/order'

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2C6.516 2 2.016 6.5 2.016 12.016c0 1.953.563 3.844 1.625 5.484L2 22l4.672-1.609a9.98 9.98 0 0 0 5.359 1.547h.016c5.516 0 10.016-4.5 10.016-10.016 0-2.672-1.047-5.188-2.938-7.078A9.97 9.97 0 0 0 12.031 2zm0 18.234h-.016a8.28 8.28 0 0 1-4.234-1.156l-.313-.188-3.141 1.078 1.047-3.063-.203-.328a8.26 8.26 0 0 1-1.391-4.563c0-4.563 3.719-8.281 8.281-8.281 2.219 0 4.297.859 5.859 2.422a8.25 8.25 0 0 1 2.422 5.859c0 4.563-3.719 8.22-8.312 8.22zm4.547-6.188c-.25-.125-1.469-.734-1.703-.812-.234-.094-.406-.125-.578.125-.172.25-.672.828-.828 1-.156.172-.313.203-.563.078-.25-.125-1.062-.391-2.016-1.25a7.53 7.53 0 0 1-1.391-1.734c-.156-.25-.016-.391.109-.516.109-.109.25-.281.375-.422.125-.141.172-.25.25-.406.078-.172.047-.313-.016-.438-.078-.125-.578-1.406-.812-1.922-.219-.516-.438-.453-.594-.453-.156 0-.328-.016-.5-.016s-.453.063-.688.313c-.234.25-.906.891-.906 2.172s.922 2.516 1.047 2.688c.125.172 1.828 2.781 4.422 3.906.625.266 1.109.438 1.484.563.625.188 1.188.172 1.641.109.5-.078 1.469-.609 1.672-1.203.203-.594.203-1.094.141-1.203-.063-.109-.234-.172-.484-.297z" />
    </svg>
  )
}

function UpiIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { formatPrice, currentCurrency } = useCurrency()
  const storeSettings = useStoreSettings()
  const { user, openAuthModal } = useAuth()
  const {
    items,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getGrandTotal,
    coupon,
    clearCart,
  } = useCartStore()

  // Customer Information (Phase 3)
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [emailAddress, setEmailAddress] = useState('')

  // Delivery Address (Phase 3)
  const [house, setHouse] = useState('')
  const [street, setStreet] = useState('')
  const [landmark, setLandmark] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('Gujarat')
  const [pincode, setPincode] = useState('')
  const [country] = useState('India')

  // Validation & Processing States
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Auto-fill logged-in customer info if available
  useEffect(() => {
    if (user) {
      if (user.name && !fullName) setFullName(user.name)
      if (user.email && !emailAddress) setEmailAddress(user.email)
      if (user.savedAddresses && user.savedAddresses.length > 0) {
        const defaultAddr = user.savedAddresses.find((a) => a.isDefault) || user.savedAddresses[0]
        if (defaultAddr) {
          if (defaultAddr.addressLine1 && !house) {
            setHouse(defaultAddr.addressLine1)
          }
          if (defaultAddr.addressLine2 && !street) {
            setStreet(defaultAddr.addressLine2)
          }
          if (defaultAddr.city && !city) setCity(defaultAddr.city)
          if (defaultAddr.state && !state) setState(defaultAddr.state)
          if (defaultAddr.postalCode && !pincode) setPincode(defaultAddr.postalCode)
        }
      }
    }
  }, [user, fullName, emailAddress, house, street, city, state, pincode])

  // Restore saved contact details from previous checkout attempt
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedName = localStorage.getItem('lovixa_checkout_name')
        const savedPhone = localStorage.getItem('lovixa_checkout_phone')
        const savedEmail = localStorage.getItem('lovixa_checkout_email')
        if (savedName && !fullName) setFullName(savedName)
        if (savedPhone && !mobileNumber) setMobileNumber(savedPhone)
        if (savedEmail && !emailAddress) setEmailAddress(savedEmail)
      } catch (e) {}
    }
  }, [fullName, mobileNumber, emailAddress])

  const subtotal = getSubtotal()
  const discount = getDiscountAmount()
  const shipping = getShippingFee()
  const grandTotal = getGrandTotal()

  // Configurable shipping thresholds
  const freeShippingThreshold = storeSettings?.shipping?.freeShippingThreshold ?? 999
  const freeShippingEnabled = storeSettings?.shipping?.freeShippingEnabled !== false
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)

  // Validate form fields according to Phase 3 & 10 rules
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // 1. Full Name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your complete name'
    }

    // 2. Mobile Number (Indian validation)
    const phoneCheck = validateIndianMobile(mobileNumber)
    if (!phoneCheck.valid) {
      newErrors.mobileNumber = phoneCheck.error || 'Valid 10-digit Indian mobile number is required'
    }

    // 3. Email (Optional, but validate format if entered)
    if (emailAddress.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailAddress.trim())) {
        newErrors.emailAddress = 'Please enter a valid email address or leave blank'
      }
    }

    // 4. Delivery Address: House / Flat / Building
    if (!house.trim()) {
      newErrors.house = 'House / Flat / Building name is required'
    }

    // 5. Street / Area / Locality
    if (!street.trim()) {
      newErrors.street = 'Street / Area / Locality is required'
    }

    // 6. City
    if (!city.trim()) {
      newErrors.city = 'City is required'
    }

    // 7. State
    if (!state.trim()) {
      newErrors.state = 'State is required'
    }

    // 8. Pincode (Indian 6-digit validation + serviceable check)
    const serviceableList = storeSettings?.shipping?.serviceablePincodes
    const pinCheck = validateIndianPincode(pincode, serviceableList)
    if (!pinCheck.valid) {
      newErrors.pincode = pinCheck.error || 'Valid 6-digit Indian pincode is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty. Please add items before checking out.')
      return
    }

    if (!validateForm()) {
      setErrorMessage('Please correct the highlighted fields before placing your order.')
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    try {
      // Clean phone number
      const phoneValidation = validateIndianMobile(mobileNumber)
      const cleanPhone = phoneValidation.normalized

      const rate = currentCurrency?.exchangeRate || 1
      const orderCurrency = currentCurrency?.code || 'INR'
      const orderCurrencySymbol = currentCurrency?.symbol || '₹'

      const convertedSubtotal = Number((subtotal * rate).toFixed(2))
      const convertedDiscount = Number((discount * rate).toFixed(2))
      const convertedShipping = Number((shipping * rate).toFixed(2))
      const convertedGrandTotal = Number((grandTotal * rate).toFixed(2))

      const orderPayload = {
        existingOrderId: activeOrderId || undefined,
        customerId: user?.id,
        customerName: fullName.trim(),
        customerPhone: cleanPhone,
        customerEmail: emailAddress.trim() || undefined,
        shippingAddress: {
          firstName: fullName.trim().split(' ')[0] || '',
          lastName: fullName.trim().split(' ').slice(1).join(' ') || '',
          house: house.trim(),
          street: street.trim(),
          landmark: landmark.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postalCode: pincode.trim(),
          pincode: pincode.trim(),
          country: 'India',
        },
        currency: orderCurrency,
        currencySymbol: orderCurrencySymbol,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          title: item.title,
          price: Number((item.price * rate).toFixed(2)),
          quantity: item.quantity,
          image: item.image,
          optionsSummary: item.optionsSummary,
        })),
        subtotal: convertedSubtotal,
        discountTotal: convertedDiscount,
        couponCode: coupon?.code,
        shippingTotal: convertedShipping,
        taxTotal: 0,
        grandTotal: convertedGrandTotal,
        paymentProvider: 'whatsapp_manual',
      }

      // 1. Persist Pending Order on Server (Phase 5 & 6)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order. Please check your details and try again.')
      }

      if (data.orderId) {
        setActiveOrderId(data.orderId)
      }

      // Save customer contact details for future visits
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('lovixa_checkout_name', fullName.trim())
          localStorage.setItem('lovixa_checkout_phone', cleanPhone)
          if (emailAddress.trim()) {
            localStorage.setItem('lovixa_checkout_email', emailAddress.trim())
          }
          // Store order snapshot for the success receipt page
          sessionStorage.setItem(
            'lovixa_last_order',
            JSON.stringify({
              orderNumber: data.orderNumber,
              guestAccessToken: data.guestAccessToken,
              whatsappUrl: data.whatsappUrl,
              whatsappMessage: data.whatsappMessage,
              businessNumber: data.businessNumber,
              customerName: fullName.trim(),
              customerPhone: cleanPhone,
              customerEmail: emailAddress.trim() || undefined,
              grandTotal: convertedGrandTotal,
              currencySymbol: orderCurrencySymbol,
              itemsCount: items.reduce((s, i) => s + i.quantity, 0),
            })
          )
        } catch (e) {}
      }

      // 2. Clear Cart Store
      clearCart()

      // 3. Open WhatsApp Click-to-Chat in new tab/app (Phase 4)
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank')
      }

      // 4. Redirect customer to Confirmation / Receipt page with guest access token
      const tokenParam = data.guestAccessToken ? `&token=${encodeURIComponent(data.guestAccessToken)}` : ''
      router.push(`/checkout/success?order_id=${encodeURIComponent(data.orderNumber)}${tokenParam}`)
    } catch (err: any) {
      console.error('Checkout error:', err)
      setErrorMessage(err.message || 'An error occurred while creating your order. Please try again.')
      setIsProcessing(false)
    }
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="bg-[#FBF6F8] min-h-[75vh] py-16 text-[#2B1822]">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E8C4D4]/30 text-[#6B2D5C] border border-[#E8C4D4] flex items-center justify-center mx-auto shadow-2xs">
            <WhatsAppIcon className="w-8 h-8 text-[#25D366]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-[#2B1822]">
            Your Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-sans leading-relaxed">
            Looks like you haven&apos;t added any LOVIXA Ayurvedic essentials to your bag yet. Browse our collection to begin.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6B2D5C] hover:bg-[#562349] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all cursor-pointer font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Essentials</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FBF6F8] min-h-screen py-8 sm:py-14 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8C4D4]/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                WhatsApp Direct Checkout
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[#2B1822] tracking-tight">
              Order on WhatsApp &amp; Manual Payment
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-sans mt-1">
              No online card gateway required. Review items, enter delivery address, and send order to our official WhatsApp team.
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B2D5C] hover:text-[#562349] font-sans transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Bag</span>
          </Link>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-700 font-medium font-sans">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
            
            {/* Account Status (Optional Guest Checkout) */}
            {user ? (
              <div className="p-4 bg-white border border-[#E8C4D4]/60 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center font-bold text-xs font-sans">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2B1822] font-sans">
                      Signed in as {user.name || user.email}
                    </p>
                    <p className="text-[11px] text-[#6B2D5C] font-sans">
                      Order will be automatically linked to your customer portal.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white border border-[#E8C4D4]/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#6B2D5C] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#2B1822] font-sans">
                      Guest Checkout Active
                    </p>
                    <p className="text-[11px] text-stone-600 font-sans">
                      No account required. Fill in your details below to place order via WhatsApp.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="py-1.5 px-3.5 bg-[#FBF6F8] hover:bg-[#E8C4D4]/40 border border-[#E8C4D4] text-[#6B2D5C] rounded-full text-[11px] font-bold transition whitespace-nowrap cursor-pointer text-center font-sans uppercase tracking-wider self-start sm:self-auto"
                >
                  Sign In (Optional)
                </button>
              </div>
            )}

            {/* 1. Customer Information */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8C4D4]/60 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8C4D4]/40">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B2D5C] font-sans flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center text-[11px]">1</span>
                  <span>Customer Information</span>
                </h2>
                <span className="text-[11px] text-stone-500 font-sans">* Required for WhatsApp contact</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="customer-name" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors({ ...errors, fullName: '' })
                    }}
                    placeholder="e.g. Priya Sharma"
                    className={`w-full px-4 py-3 text-xs sm:text-sm bg-[#FBF6F8] border rounded-xl text-[#2B1822] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition font-sans ${
                      errors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-[#E8C4D4]/80'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-600 mt-1 font-sans">{errors.fullName}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="customer-phone" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                    WhatsApp Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-stone-500 font-sans select-none">
                      +91
                    </span>
                    <input
                      id="customer-phone"
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value)
                        if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: '' })
                      }}
                      placeholder="94098 76865"
                      className={`w-full pl-12 pr-4 py-3 text-xs sm:text-sm bg-[#FBF6F8] border rounded-xl text-[#2B1822] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition font-sans ${
                        errors.mobileNumber ? 'border-rose-400 bg-rose-50/30' : 'border-[#E8C4D4]/80'
                      }`}
                    />
                  </div>
                  {errors.mobileNumber ? (
                    <p className="text-[11px] text-rose-600 mt-1 font-sans">{errors.mobileNumber}</p>
                  ) : (
                    <p className="text-[11px] text-stone-400 mt-1 font-sans">
                      Our concierge team will reach out to this WhatsApp number.
                    </p>
                  )}
                </div>

                {/* Email Address (Optional) */}
                <div>
                  <label htmlFor="customer-email" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[11px] font-normal text-stone-400">Optional</span>
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => {
                      setEmailAddress(e.target.value)
                      if (errors.emailAddress) setErrors({ ...errors, emailAddress: '' })
                    }}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 text-xs sm:text-sm bg-[#FBF6F8] border rounded-xl text-[#2B1822] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition font-sans ${
                      errors.emailAddress ? 'border-rose-400 bg-rose-50/30' : 'border-[#E8C4D4]/80'
                    }`}
                  />
                  {errors.emailAddress ? (
                    <p className="text-[11px] text-rose-600 mt-1 font-sans">{errors.emailAddress}</p>
                  ) : (
                    <p className="text-[11px] text-stone-400 mt-1 font-sans">
                      For receiving itemized PDF invoice and tracking updates.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8C4D4]/60 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8C4D4]/40">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B2D5C] font-sans flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center text-[11px]">2</span>
                  <span>Delivery Address</span>
                </h2>
                <span className="text-[11px] text-emerald-700 font-bold font-sans flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Pan-India Shipping
                </span>
              </div>

              <div className="space-y-4">
                {/* House / Flat / Building */}
                <div>
                  <label htmlFor="addr-house" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                    House / Flat / Building / Floor <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="addr-house"
                    type="text"
                    required
                    value={house}
                    onChange={(e) => {
                      setHouse(e.target.value)
                      if (errors.house) setErrors({ ...errors, house: '' })
                    }}
                    placeholder="e.g. House No. 12, Jai Bhawani Society"
                    className={`w-full px-4 py-3 text-xs sm:text-sm bg-[#FBF6F8] border rounded-xl text-[#2B1822] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition font-sans ${
                      errors.house ? 'border-rose-400 bg-rose-50/30' : 'border-[#E8C4D4]/80'
                    }`}
                  />
                  {errors.house && (
                    <p className="text-[11px] text-rose-600 mt-1 font-sans">{errors.house}</p>
                  )}
                </div>

                {/* Street / Area / Locality */}
                <div>
                  <label htmlFor="addr-street" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                    Street / Area / Locality <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="addr-street"
                    type="text"
                    required
                    value={street}
                    onChange={(e) => {
                      setStreet(e.target.value)
                      if (errors.street) setErrors({ ...errors, street: '' })
                    }}
                    placeholder="e.g. Yogi Chowk Rd, Varachha"
                    className={`w-full px-4 py-3 text-xs sm:text-sm bg-[#FBF6F8] border rounded-xl text-[#2B1822] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition font-sans ${
                      errors.street ? 'border-rose-400 bg-rose-50/30' : 'border-[#E8C4D4]/80'
                    }`}
                  />
                  {errors.street && (
                    <p className="text-[11px] text-rose-600 mt-1 font-sans">{errors.street}</p>
                  )}
                </div>

                {/* Landmark (Optional) */}
                <div>
                  <label htmlFor="addr-landmark" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans flex items-center justify-between">
                    <span>Landmark</span>
                    <span className="text-[11px] font-normal text-stone-400">Optional</span>
                  </label>
                  <input
                    id="addr-landmark"
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Shanti Asiatic School"
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#FBF6F8] border border-[#E8C4D4]/80 rounded-xl text-[#2B1822] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition font-sans"
                  />
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="addr-city" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="addr-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value)
                        if (errors.city) setErrors({ ...errors, city: '' })
                      }}
                      placeholder="e.g. Surat"
                      className={`w-full px-4 py-3 text-xs sm:text-sm bg-[#FBF6F8] border rounded-xl text-[#2B1822] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition font-sans ${
                        errors.city ? 'border-rose-400 bg-rose-50/30' : 'border-[#E8C4D4]/80'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-[11px] text-rose-600 mt-1 font-sans">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="addr-state" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="addr-state"
                        required
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value)
                          if (errors.state) setErrors({ ...errors, state: '' })
                        }}
                        className={`w-full appearance-none px-4 py-3 text-xs sm:text-sm bg-[#FBF6F8] border rounded-xl text-[#2B1822] focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition font-sans cursor-pointer ${
                          errors.state ? 'border-rose-400 bg-rose-50/30' : 'border-[#E8C4D4]/80'
                        }`}
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                    {errors.state && (
                      <p className="text-[11px] text-rose-600 mt-1 font-sans">{errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="addr-pincode" className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                      Pincode <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="addr-pincode"
                      type="text"
                      maxLength={6}
                      required
                      value={pincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        setPincode(val)
                        if (errors.pincode) setErrors({ ...errors, pincode: '' })
                      }}
                      placeholder="e.g. 395011"
                      className={`w-full px-4 py-3 text-xs sm:text-sm bg-[#FBF6F8] border rounded-xl text-[#2B1822] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-[#6B2D5C] focus:ring-1 focus:ring-[#6B2D5C] transition font-sans ${
                        errors.pincode ? 'border-rose-400 bg-rose-50/30' : 'border-[#E8C4D4]/80'
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-[11px] text-rose-600 mt-1 font-sans">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-semibold text-[#2B1822] mb-1.5 font-sans">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-stone-100/70 border border-[#E8C4D4]/60 rounded-xl text-stone-600 font-sans cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 3. Manual Payment Method Notice */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E8C4D4]/60 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8C4D4]/40">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B2D5C] font-sans flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#6B2D5C] text-white flex items-center justify-center text-[11px]">3</span>
                  <span>Payment Method</span>
                </h2>
                <span className="text-[11px] text-stone-500 font-sans">Manual Verification</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF6F8] border border-[#6B2D5C]/20 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#6B2D5C] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <UpiIcon className="w-5 h-5 text-[#E8C4D4]" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#2B1822] font-sans">
                      Manual UPI / Bank Transfer
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Zero Gateway Fees
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">
                    You will not be asked to enter card details or PIN online. After sending your order on WhatsApp, our concierge team will verify stock and share our verified business UPI ID / QR code for payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary WhatsApp CTA Button */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isProcessing || items.length === 0}
                className="w-full py-4 px-6 bg-[#6B2D5C] hover:bg-[#562349] active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer font-sans group"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing Order Details...</span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <WhatsAppIcon className="w-4 h-4 fill-current" />
                    </div>
                    <span>Place Order on WhatsApp • {formatPrice(grandTotal)}</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-stone-500 font-sans leading-normal">
                Review your order and send it to our WhatsApp team for confirmation.
              </p>

              {/* Privacy Notice (Phase 10) */}
              <div className="p-3 bg-white border border-[#E8C4D4]/60 rounded-xl text-[11px] text-stone-500 flex items-center gap-2 font-sans">
                <ShieldCheck className="w-4 h-4 text-[#6B2D5C] shrink-0" />
                <span>
                  Protected by 256-bit SSL encryption. We will never ask for your UPI PIN or banking passwords.
                </span>
              </div>
            </div>

          </form>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E8C4D4]/70 rounded-3xl p-6 sm:p-7 space-y-6 sticky top-24 shadow-2xs">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#E8C4D4]/50">
                <h3 className="font-sans text-lg font-bold text-[#2B1822]">
                  Order Summary
                </h3>
                <span className="text-xs font-semibold text-[#6B2D5C] font-sans">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Free Shipping Progress Indicator */}
              {freeShippingEnabled && (
                <div className="p-3 rounded-xl bg-[#FBF6F8] border border-[#E8C4D4]/70 text-xs font-sans space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-[#2B1822] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#6B2D5C]" />
                      <span>Free Pan-India Delivery</span>
                    </span>
                    <span className="text-[#6B2D5C] font-bold">
                      {remainingForFreeShipping === 0
                        ? 'UNLOCKED'
                        : `Add ${formatPrice(remainingForFreeShipping)} more`}
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#6B2D5C] h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1 font-sans divide-y divide-[#E8C4D4]/30">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || 'base'}`}
                    className="flex items-center gap-3 pt-3 first:pt-0"
                  >
                    {item.image && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-[#E8C4D4]/60 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-[#2B1822] truncate">
                        {item.title}
                      </p>
                      {item.optionsSummary && (
                        <p className="text-[11px] text-stone-500 truncate">
                          Variant: {item.optionsSummary}
                        </p>
                      )}
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-bold text-xs text-[#2B1822] shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations Breakdown */}
              <div className="space-y-2.5 text-xs text-stone-600 border-t border-[#E8C4D4]/70 pt-4 font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2B1822]">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#6B2D5C] font-semibold">
                    <span>Discount ({coupon?.code || 'Applied'})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-emerald-700 font-bold' : 'text-[#2B1822]'}`}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-sans font-bold text-[#2B1822] border-t border-[#E8C4D4]/70 pt-3">
                  <span>Grand Total</span>
                  <span className="text-[#6B2D5C]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-2 border-t border-[#E8C4D4]/40 text-[11px] text-stone-600 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Ayurvedic &amp; Botanical Formulations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dispatched in 24 hours with tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dedicated LOVIXA Concierge on WhatsApp</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
