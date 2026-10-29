'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Calendar, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react'
import { PageHeaderBanner } from '@/components/common/PageHeaderBanner'
import type { BlogPostDocument } from '@/lib/cms/blog'

const CATEGORIES = [
  { id: 'all', label: 'All Articles' },
  { id: 'hair-wellness', label: 'Hair Wellness' },
  { id: 'rituals', label: 'Self-Care Rituals' },
  { id: 'botanical-science', label: 'Botanical Science' },
  { id: 'ayurvedic-care', label: 'Ayurvedic Scalp Care' },
]

interface BlogListClientProps {
  initialPosts: BlogPostDocument[]
}

export function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Extract all distinct tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    initialPosts.forEach((post) => {
      post.tags?.forEach((t) => {
        if (t.tag) tagsSet.add(t.tag)
      })
    })
    return Array.from(tagsSet)
  }, [initialPosts])

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Category filter
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false
      }
      // Tag filter
      if (selectedTag && !post.tags?.some((t) => t.tag.toLowerCase() === selectedTag.toLowerCase())) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = post.title.toLowerCase().includes(q)
        const matchesExcerpt = post.excerpt?.toLowerCase().includes(q)
        if (!matchesTitle && !matchesExcerpt) return false
      }
      return true
    })
  }, [initialPosts, selectedCategory, selectedTag, searchQuery])

  return (
    <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeaderBanner
          breadcrumbs={[{ label: 'Hair Wellness Journal' }]}
          badge="BOTANICAL WISDOM & RITUALS"
          title="The Hair Care Journal,"
          highlightTitle="Holistic Scalp & Strand Wellness"
          subtitle="Discover expert Ayurvedic insights, rosemary oil rituals, gentle formulation science, and practical guides for healthier, radiant hair."
          imageSrc="/images/lovixa-panoramic-hero.jpg"
          imageAlt="LOVIXA Hair Care Journal"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-8">
        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8C4D4]/60 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#6B2D5C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by topic, concern, ingredient..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FBF6F8] border border-[#E8C4D4]/60 text-xs sm:text-sm text-[#2B1822] placeholder:text-[#2B1822]/40 focus:outline-none focus:bg-white focus:border-[#6B2D5C] transition-all font-sans"
              />
            </div>

            {/* Clear Filters Button */}
            {(selectedCategory !== 'all' || selectedTag || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedTag(null)
                  setSearchQuery('')
                }}
                className="text-xs font-bold text-[#6B2D5C] hover:underline self-end md:self-center cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer font-sans shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#6B2D5C] text-white shadow-xs'
                    : 'bg-[#FBF6F8] text-[#2B1822] hover:bg-[#E8C4D4]/30 hover:text-[#6B2D5C] border border-[#E8C4D4]/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tag Pills (if available) */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[#E8C4D4]/40">
              <span className="text-[11px] font-bold text-[#2B1822]/60 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3 text-[#6B2D5C]" />
                <span>Topics:</span>
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors cursor-pointer font-sans ${
                    selectedTag === tag
                      ? 'bg-[#6B2D5C] text-white'
                      : 'bg-[#E8C4D4]/25 text-[#2B1822]/80 hover:bg-[#E8C4D4]/50'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPosts.map((post) => {
              const imageSrc =
                (typeof post.featuredImage === 'object' && post.featuredImage?.url) ||
                post.featuredImageUrl ||
                '/images/lovixa-hero.jpg'
              const formattedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'October 2026'

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8C4D4]/60 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-[16/10] overflow-hidden bg-[#FBF6F8] block"
                  >
                    <Image
                      src={imageSrc}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold tracking-wider uppercase text-[#6B2D5C] shadow-xs">
                        {post.category}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-[#2B1822]/60 font-sans">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#6B2D5C]" />
                          <span>{formattedDate}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#6B2D5C]" />
                          <span>{post.readTime || '4 min read'}</span>
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold font-serif text-[#2B1822] group-hover:text-[#6B2D5C] transition-colors leading-snug line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-[#2B1822]/75 font-sans leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8C4D4]/30 flex items-center justify-between">
                      <span className="text-[11px] text-[#2B1822]/60 font-sans">
                        By {post.author || 'LOVIXA Team'}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-[#6B2D5C] hover:text-[#562349] flex items-center gap-1 group/btn font-sans"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E8C4D4]/60 max-w-lg mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-[#6B2D5C] mx-auto opacity-40" />
            <h3 className="text-lg font-bold text-[#2B1822]">No articles found</h3>
            <p className="text-xs sm:text-sm text-[#2B1822]/70 font-sans">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedTag(null)
                setSearchQuery('')
              }}
              className="mt-2 px-5 py-2 rounded-full bg-[#6B2D5C] text-white text-xs font-bold tracking-wide"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
