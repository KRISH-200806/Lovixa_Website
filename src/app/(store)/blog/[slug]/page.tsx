import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/cms/blog'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { BlogShareButtons } from '@/components/blog/BlogShareButtons'

export const revalidate = 300

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {}
  }

  const title = post.seo?.metaTitle || post.title || `${post.title} — LOVIXA COSMETIC`
  const description = post.seo?.metaDescription || post.excerpt || post.title
  const canonicalUrl = post.seo?.canonicalUrl || `https://www.lovixacosmetic.com/blog/${slug}`

  const ogImageUrl =
    (typeof post.seo?.ogImage === 'object' && post.seo?.ogImage?.url) ||
    (typeof post.featuredImage === 'object' && post.featuredImage?.url) ||
    post.featuredImageUrl ||
    'https://www.lovixacosmetic.com/images/lovixa-og.jpg'

  return {
    title,
    description,
    keywords: post.seo?.focusKeywords || post.tags?.map((t) => t.tag).join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: post.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: post.seo?.ogTitle || title,
      description: post.seo?.ogDescription || description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      authors: [post.author || 'LOVIXA Team'],
      tags: post.tags?.map((t) => t.tag),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: post.seo?.twitterCard || 'summary_large_image',
      title: post.seo?.ogTitle || title,
      description: post.seo?.ogDescription || description,
      images: [ogImageUrl],
    },
  }
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedBlogPosts(slug, post.category, 3)

  const coverImage =
    (typeof post.featuredImage === 'object' && post.featuredImage?.url) ||
    post.featuredImageUrl ||
    '/images/lovixa-hero.jpg'

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'October 2026'

  const articleUrl = `https://www.lovixacosmetic.com/blog/${slug}`

  // 1. Article JSON-LD Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [coverImage],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author || 'LOVIXA Botanical Research Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LOVIXA COSMETIC',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.lovixacosmetic.com/images/lovixa-logo.webp',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  }

  // 2. Breadcrumb JSON-LD Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.lovixacosmetic.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Journal',
        item: 'https://www.lovixacosmetic.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  }

  // 3. Optional FAQ Schema
  const faqSchema =
    post.faqSection && post.faqSection.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqSection.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="bg-[#FBF6F8] min-h-[75vh] py-6 sm:py-10 text-[#2B1822]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-xs font-sans text-[#2B1822]/60">
            <Link href="/blog" className="hover:text-[#6B2D5C] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Journal</span>
            </Link>
            <span>/</span>
            <span className="text-[#6B2D5C] font-semibold">{post.category}</span>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8C4D4]/30 border border-[#E8C4D4]/60 text-xs font-bold text-[#6B2D5C] uppercase tracking-wider font-sans">
              <span>{post.category}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2B1822] leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-[#2B1822]/80 leading-relaxed font-sans">
              {post.excerpt}
            </p>

            {/* Author, Date, Reading Time Metadata Bar */}
            <div className="pt-2 pb-4 border-b border-[#E8C4D4]/50 flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-[#2B1822]/70">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium text-[#2B1822]">
                  <User className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  <span>{post.author || 'LOVIXA Botanical Team'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  <span>{formattedDate}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#6B2D5C]" />
                  <span>{post.readTime || '4 min read'}</span>
                </span>
              </div>

              {/* Share Component */}
              <BlogShareButtons url={articleUrl} title={post.title} />
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="relative aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8C4D4]/60 shadow-sm bg-white">
            <Image
              src={coverImage}
              alt={post.featuredImageAlt || post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8C4D4]/60 p-6 sm:p-10 shadow-xs prose prose-stone max-w-none font-sans leading-relaxed text-[#2B1822]">
            {post.content ? (
              <RichText data={post.content} />
            ) : (
              <p className="text-sm text-[#2B1822]/70">No content available.</p>
            )}
          </div>

          {/* Article Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#2B1822]/70 uppercase tracking-wider mr-2 font-sans">
                Tags:
              </span>
              {post.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white border border-[#E8C4D4]/60 text-xs font-medium text-[#6B2D5C] font-sans"
                >
                  #{t.tag}
                </span>
              ))}
            </div>
          )}

          {/* Optional FAQ Section */}
          {post.faqSection && post.faqSection.length > 0 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8C4D4]/60 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-xl font-bold font-sans text-[#2B1822]">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3 pt-2">
                {post.faqSection.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FBF6F8] border border-[#E8C4D4]/50 space-y-1.5"
                  >
                    <h4 className="text-sm font-bold text-[#2B1822] font-sans">
                      {faq.question}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#2B1822]/75 font-sans leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Share Bar */}
          <div className="p-6 rounded-2xl bg-[#E8C4D4]/20 border border-[#E8C4D4]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-[#2B1822] font-sans">
                Found this ritual helpful?
              </h4>
              <p className="text-xs text-[#2B1822]/70 font-sans mt-0.5">
                Share this article with family and friends who care for healthy hair.
              </p>
            </div>
            <BlogShareButtons url={articleUrl} title={post.title} />
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-[#E8C4D4]/60">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2B1822]">
                Related Hair Wellness Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => {
                  const relImage =
                    (typeof rel.featuredImage === 'object' && rel.featuredImage?.url) ||
                    rel.featuredImageUrl ||
                    '/images/lovixa-hero.jpg'

                  return (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="bg-white rounded-2xl border border-[#E8C4D4]/60 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#FBF6F8]">
                        <Image
                          src={relImage}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                        <span className="text-[10px] font-bold text-[#6B2D5C] uppercase tracking-wider">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-bold font-serif text-[#2B1822] line-clamp-2 group-hover:text-[#6B2D5C] transition-colors">
                          {rel.title}
                        </h4>
                        <span className="text-[11px] font-bold text-[#6B2D5C] flex items-center gap-1 pt-2">
                          <span>Read More</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
