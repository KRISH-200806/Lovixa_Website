export function generateProductJsonLd({
  title,
  description,
  images,
  sku,
  price,
  currency = 'INR',
  availability = 'InStock',
  brandName = 'LOVIXA COSMETIC',
  ratingValue = 4.9,
  reviewCount = 38,
  url,
}: {
  title: string
  description: string
  images: string[]
  sku?: string
  price: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  brandName?: string
  ratingValue?: number
  reviewCount?: number
  url?: string
}) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: title,
    image: images,
    description: description,
    sku: sku || undefined,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    offers: {
      '@type': 'Offer',
      url: url || undefined,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: brandName,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toString(),
      reviewCount: reviewCount.toString(),
    },
  }
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; item?: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      ...(crumb.item ? { item: crumb.item } : {}),
    })),
  }
}

export function generateOrganizationJsonLd({
  name = 'LOVIXA COSMETIC',
  url = 'https://lovixacosmetic.com',
  logo = 'https://lovixacosmetic.com/images/lovixa-logo.png',
  contactEmail = 'lovixacosmetic@gmail.com',
  contactPhone = '+91 97124 60509',
  socialLinks = [
    'https://www.instagram.com/lovixa_cosmetic',
    'https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/',
    'https://wa.me/919712460509',
  ],
}: {
  name?: string
  url?: string
  logo?: string
  contactEmail?: string
  contactPhone?: string
  socialLinks?: string[]
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha',
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      postalCode: '395011',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contactPhone,
      contactType: 'customer service',
      email: contactEmail,
      availableLanguage: ['en', 'hi', 'gu'],
    },
    sameAs: socialLinks,
  }
}

export function generateWebSiteJsonLd({
  url = 'https://lovixacosmetic.com',
  name = 'LOVIXA COSMETIC',
}: {
  url?: string
  name?: string
} = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
