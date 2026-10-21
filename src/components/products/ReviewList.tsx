'use client'

import { Star, CheckCircle, MessageSquare, AlertCircle, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

export interface Review {
  id: string
  authorName: string
  rating: number
  title: string
  comment: string
  isVerifiedBuyer?: boolean
  createdAt: string
}

export function ReviewList({
  reviews = [],
  productId,
  productSlug,
  initialReviews,
  averageRating: propAverageRating,
  totalReviews,
}: {
  reviews?: Review[]
  productId: string
  productSlug?: string
  initialReviews?: Review[]
  averageRating?: number
  totalReviews?: number
}) {
  const { user, requireAuth } = useAuth()
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews || reviews)
  const [showModal, setShowModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pre-fill user data when user is loaded or modal opens
  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name)
      if (user.email && !email) setEmail(user.email)
    }
  }, [user, showModal])

  // Fetch verified reviews on mount and when productId changes
  useEffect(() => {
    if (!productId) return
    let isMounted = true

    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`)
        if (res.ok) {
          const data = await res.json()
          if (isMounted && Array.isArray(data.reviews)) {
            setReviewsList(data.reviews)
          }
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err)
      }
    }

    fetchReviews()
    return () => {
      isMounted = false
    }
  }, [productId])

  const handleOpenReview = () => {
    requireAuth(() => {
      setErrorMessage(null)
      if (user) {
        if (user.name) setName(user.name)
        if (user.email) setEmail(user.email)
      }
      setShowModal(true)
    }, 'login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          authorName: name || user?.name || 'Customer',
          authorEmail: email || user?.email,
          customerId: user?.id,
          title,
          comment,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || data.reason || 'Failed to submit review. Verification check failed.')
        return
      }

      if (data.review) {
        setReviewsList((prev) => [data.review, ...prev.filter((r) => r.id !== data.review.id)])
      }
      setSubmitted(true)
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred while submitting review.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating =
    typeof propAverageRating === 'number'
      ? propAverageRating.toFixed(1)
      : reviewsList.length > 0
      ? (reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviewsList.length).toFixed(1)
      : '5.0'

  return (
    <div className="space-y-8">
      {/* Summary Banner */}
      <div className="bg-[#FBF6F8] border border-[#E8C4D4]/70 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="text-4xl font-bold font-sans text-[#2B1822]">{averageRating}</div>
          <div>
            <div className="flex items-center gap-1 text-[#6B2D5C]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(Number(averageRating)) ? 'fill-[#6B2D5C] text-[#6B2D5C]' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-[#2B1822]/60 mt-1 font-sans">
              Based on {reviewsList.length} {reviewsList.length === 1 ? 'customer review' : 'customer reviews'}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenReview}
          className="btn-primary !py-2.5 !px-5"
        >
          <MessageSquare className="w-4 h-4 text-[#E8C4D4]" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B1822]/70 backdrop-blur-sm">
          <div className="bg-[#FBF6F8] border border-[#E8C4D4]/70 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8C4D4]/60">
              <div>
                <h3 className="text-lg font-sans font-bold text-[#2B1822]">Write a Customer Review</h3>
                <p className="text-[11px] text-[#2B1822]/60 flex items-center gap-1 mt-0.5 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  Only verified buyers of this product can submit reviews
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#6B2D5C] mx-auto" />
                <h4 className="font-sans font-bold text-[#2B1822] text-base">Verified Review Published!</h4>
                <p className="text-xs text-[#2B1822]/60 max-w-sm mx-auto font-sans">
                  Thank you for sharing your authentic feedback. Your review is now visible to other customers.
                </p>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSubmitted(false)
                    setName('')
                    setEmail('')
                    setTitle('')
                    setComment('')
                  }}
                  className="px-6 py-2.5 bg-[#6B2D5C] text-white text-xs rounded-full font-semibold uppercase tracking-wider hover:bg-[#562349] transition-colors cursor-pointer font-sans"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                {errorMessage && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-rose-900">Purchase Verification Required</p>
                      <p className="text-[11px] text-rose-700 mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-xs text-[#2B1822] mb-1 font-sans">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-[#6B2D5C] text-[#6B2D5C]' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] text-[#2B1822] mb-1 font-sans">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#E8C4D4]/70 text-[#2B1822] rounded-xl focus:outline-none focus:border-[#6B2D5C] text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-[11px] text-[#2B1822] mb-1 font-sans">
                      Account / Order Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#E8C4D4]/70 text-[#2B1822] rounded-xl focus:outline-none focus:border-[#6B2D5C] text-xs font-sans"
                    />
                    <p className="text-[10px] text-stone-400 mt-1 font-sans">Must match email used at checkout.</p>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] text-[#2B1822] mb-1 font-sans">Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Outstanding quality and fast shipping!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E8C4D4]/70 text-[#2B1822] rounded-xl focus:outline-none focus:border-[#6B2D5C] text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[11px] text-[#2B1822] mb-1 font-sans">Detailed Feedback</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your experience with this item..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E8C4D4]/70 text-[#2B1822] rounded-xl focus:outline-none focus:border-[#6B2D5C] text-xs font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E8C4D4]/60">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-[#E8C4D4]/70 text-[#2B1822] rounded-full hover:bg-[#E8C4D4]/20 font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#6B2D5C] text-white rounded-full hover:bg-[#562349] font-semibold uppercase tracking-wider text-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer font-sans shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Purchase...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Review Feed */}
      {reviewsList.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#FBF6F8] rounded-2xl border border-[#E8C4D4]/70">
          <div className="w-12 h-12 bg-[#E8C4D4]/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs border border-[#E8C4D4]/60">
            <MessageSquare className="w-5 h-5 text-[#6B2D5C]" />
          </div>
          <h3 className="text-sm font-sans font-bold text-[#2B1822]">No Customer Reviews Yet</h3>
          <p className="text-xs text-[#2B1822]/60 mt-1 max-w-sm mx-auto font-sans">
            Have you purchased this product? Click &quot;Write a Review&quot; to share your verified experience.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewsList.map((rev) => {
            const formattedDate = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : ''

            return (
              <div key={rev.id} className="p-5 border border-[#E8C4D4]/70 rounded-2xl bg-white space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-[#2B1822] font-sans">{rev.authorName}</span>
                    {rev.isVerifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B2D5C] bg-[#E8C4D4]/30 border border-[#E8C4D4]/60 px-2.5 py-0.5 rounded-full font-sans">
                        <CheckCircle className="w-3 h-3 text-[#6B2D5C]" />
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-[#6B2D5C]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-[#6B2D5C] text-[#6B2D5C]' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    {formattedDate && <span className="text-[11px] text-stone-400 font-sans">{formattedDate}</span>}
                  </div>
                </div>
                <h4 className="font-sans font-semibold text-sm text-[#2B1822]">{rev.title}</h4>
                <p className="text-xs text-[#2B1822]/75 leading-relaxed font-sans">{rev.comment}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
