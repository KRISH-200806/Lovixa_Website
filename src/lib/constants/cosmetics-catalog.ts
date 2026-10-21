import type { StorefrontProduct, StorefrontProductDetail } from '../cms/products'

export interface CosmeticCategory {
  id: string
  name: string
  slug: string
  tag: string
  itemCount: string
  image: string
  accentColor: string
}

export const COSMETIC_CATEGORIES: CosmeticCategory[] = [
  {
    id: 'cat_hair_care',
    name: 'Everyday Hair Care',
    slug: 'hair-care',
    tag: 'Nature-Inspired Essentials',
    itemCount: '2 Core Essentials',
    image: '/images/lovixa-duo.jpg',
    accentColor: '#6B2D5C',
  },
  {
    id: 'cat_shampoo',
    name: 'Refreshing Shampoo',
    slug: 'shampoo',
    tag: 'Gentle Everyday Cleansing',
    itemCount: 'Botanical Blend • 500ml',
    image: '/images/lovixa-shampoo.jpg',
    accentColor: '#2B1822',
  },
  {
    id: 'cat_hair_oil',
    name: 'Nourishing Hair Oil',
    slug: 'hair-oil',
    tag: 'Self-Care Ritual Elixir',
    itemCount: 'Cold-Pressed Botanical • 50ml',
    image: '/images/lovixa-hairoil.jpg',
    accentColor: '#6B2D5C',
  },
  {
    id: 'cat_duo',
    name: 'Hair Care Ritual Duo',
    slug: 'bundles',
    tag: 'Complete Care Pair',
    itemCount: 'Shampoo + Hair Oil Set',
    image: '/images/lovixa-duo.jpg',
    accentColor: '#562349',
  },
]

export const COSMETIC_PRODUCTS: StorefrontProduct[] = [
  {
    id: 'prod_shampoo',
    title: 'LOVIXA Shampoo',
    slug: 'lovixa-shampoo',
    price: 299,
    compareAtPrice: 399,
    brand: 'LOVIXA COSMETIC',
    rating: 4.9,
    reviewCount: 38,
    badge: 'ESSENTIAL',
    category: 'shampoo',
    categories: ['shampoo', 'hair-care'],
    image: '/images/lovixa-shampoo.jpg',
    shortDescription:
      'A refreshing addition to your everyday hair cleansing routine. Crafted to gently wash away daily build-up while keeping hair soft, balanced, and naturally luminous.',
    stock: 100,
    isPublished: true,
  },
  {
    id: 'prod_hairoil',
    title: 'LOVIXA Hair Oil',
    slug: 'lovixa-hair-oil',
    price: 299,
    compareAtPrice: 399,
    brand: 'LOVIXA COSMETIC',
    rating: 5.0,
    reviewCount: 46,
    badge: 'BESTSELLER',
    category: 'hair-oil',
    categories: ['hair-oil', 'hair-care'],
    image: '/images/lovixa-hairoil.jpg',
    shortDescription:
      'Make hair oiling a relaxing part of your self-care ritual. Deeply nourishes strands from root to tip with a lightweight botanical blend that leaves hair silky and manageable.',
    stock: 100,
    isPublished: true,
  },
  {
    id: 'prod_duo',
    title: 'LOVIXA Hair Care Duo',
    slug: 'lovixa-hair-care-duo',
    price: 549,
    compareAtPrice: 699,
    brand: 'LOVIXA COSMETIC',
    rating: 5.0,
    reviewCount: 29,
    badge: 'SPECIAL DUO',
    category: 'bundles',
    categories: ['bundles', 'hair-care'],
    image: '/images/lovixa-duo.jpg',
    shortDescription:
      'Two Essentials. One Beautiful Ritual. Pair your LOVIXA Shampoo with our Hair Oil and make every hair care day feel special.',
    stock: 50,
    isPublished: true,
  },
]

export const COSMETIC_PRODUCT_DETAILS: Record<string, StorefrontProductDetail> = {
  'lovixa-shampoo': {
    id: 'prod_shampoo',
    title: 'LOVIXA Shampoo',
    slug: 'lovixa-shampoo',
    price: 299,
    compareAtPrice: 399,
    brand: 'LOVIXA COSMETIC',
    rating: 4.9,
    reviewCount: 38,
    shortDescription:
      'A refreshing addition to your everyday hair cleansing routine. Crafted to gently wash away daily build-up while keeping hair soft, balanced, and naturally luminous.',
    stock: 100,
    isPublished: true,
    images: [
      { url: '/images/lovixa-shampoo.jpg', alt: 'LOVIXA Refreshing Shampoo Bottle 500ml' },
      { url: '/images/lovixa-duo.jpg', alt: 'LOVIXA Shampoo and Hair Oil Pair' },
      { url: '/images/lovixa-insta-4.jpg', alt: 'LOVIXA Shampoo Gentle Foaming Lather' },
    ],
    variants: [
      { id: 'var_shampoo_500', sku: 'LVX-SHMP-500ML', title: '500ml Bottle', price: 299, compareAtPrice: 399, inventory: 100 },
    ],
  },
  'lovixa-hair-oil': {
    id: 'prod_hairoil',
    title: 'LOVIXA Hair Oil',
    slug: 'lovixa-hair-oil',
    price: 299,
    compareAtPrice: 399,
    brand: 'LOVIXA COSMETIC',
    rating: 5.0,
    reviewCount: 46,
    shortDescription:
      'Make hair oiling a relaxing part of your self-care ritual. Deeply nourishes strands from root to tip with a lightweight botanical blend that leaves hair silky and manageable.',
    stock: 100,
    isPublished: true,
    images: [
      { url: '/images/lovixa-hairoil.jpg', alt: 'LOVIXA Nourishing Hair Oil Dropper Bottle 50ml' },
      { url: '/images/lovixa-duo.jpg', alt: 'LOVIXA Hair Oil with Shampoo' },
      { url: '/images/lovixa-insta-1.jpg', alt: 'LOVIXA Hair Oil Botanical Formulation' },
    ],
    variants: [
      { id: 'var_oil_50', sku: 'LVX-OIL-50ML', title: '50ml Dropper Bottle', price: 299, compareAtPrice: 399, inventory: 100 },
    ],
  },
  'lovixa-hair-care-duo': {
    id: 'prod_duo',
    title: 'LOVIXA Hair Care Duo',
    slug: 'lovixa-hair-care-duo',
    price: 549,
    compareAtPrice: 699,
    brand: 'LOVIXA COSMETIC',
    rating: 5.0,
    reviewCount: 29,
    shortDescription:
      'Two Essentials. One Beautiful Ritual. Pair your LOVIXA Shampoo with our Hair Oil and make every hair care day feel special.',
    stock: 50,
    isPublished: true,
    images: [
      { url: '/images/lovixa-duo.jpg', alt: 'LOVIXA Complete Hair Care Duo' },
      { url: '/images/lovixa-shampoo.jpg', alt: 'LOVIXA Shampoo 500ml' },
      { url: '/images/lovixa-hairoil.jpg', alt: 'LOVIXA Hair Oil 50ml' },
    ],
    variants: [
      { id: 'var_duo_set', sku: 'LVX-DUO-SET', title: 'Complete Ritual Duo Set (500ml + 50ml)', price: 549, compareAtPrice: 699, inventory: 50 },
    ],
  },
}

export const COSMETIC_TESTIMONIALS = [
  {
    author: 'Priya S.',
    role: 'Verified Customer',
    location: 'Ahmedabad',
    rating: 5,
    quote:
      'I love how calming the oil ritual feels before bed. The shampoo leaves my hair clean without that dry, straw-like stripped sensation. Simple and truly thoughtful!',
    verified: true,
    product: 'LOVIXA Hair Oil & Shampoo Duo',
  },
  {
    author: 'Ananya R.',
    role: 'Verified Customer',
    location: 'Mumbai',
    rating: 5,
    quote:
      'Finding a daily shampoo that feels light and doesn’t irritate my sensitive scalp was so hard. LOVIXA makes my hair feel so fresh, light and clean every morning.',
    verified: true,
    product: 'LOVIXA Shampoo',
  },
  {
    author: 'Devangi P.',
    role: 'Verified Customer',
    location: 'Surat',
    rating: 5,
    quote:
      'The texture of the hair oil is wonderful — not heavy or sticky. It washes out easily with the shampoo and gives my ends such a healthy, natural softness.',
    verified: true,
    product: 'LOVIXA Hair Oil',
  },
]

export const COSMETIC_INGREDIENTS = [
  {
    title: 'Cold-Pressed Botanical Elixir',
    subtitle: 'Nourishing Lipids',
    description: 'Lightweight botanical oil blend that seals cuticles, tames flyaways, and softens strands without grease.',
    iconName: 'Droplets',
  },
  {
    title: 'Provitamin B5 (Panthenol)',
    subtitle: 'Elasticity & Moisture',
    description: 'Binds moisture to the hair fiber, restoring bounce, strength, and silky natural combability.',
    iconName: 'Sparkles',
  },
  {
    title: 'Rosemary & Botanical Blend',
    subtitle: 'Scalp Awakening',
    description: 'Naturally purifies and refreshes the scalp environment for a clean, buoyant feeling after every wash.',
    iconName: 'Leaf',
  },
  {
    title: 'Gentle Plant Cleansing Base',
    subtitle: 'Balanced pH Care',
    description: 'Mild plant-derived surfactants that wash away daily dust while preserving essential protective scalp lipids.',
    iconName: 'ShieldCheck',
  },
]
