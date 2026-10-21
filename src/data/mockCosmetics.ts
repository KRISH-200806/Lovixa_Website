export interface CosmeticProduct {
  id: string
  title: string
  slug: string
  tagline: string
  category: {
    name: string
    slug: string
  }
  price: number
  compareAtPrice?: number
  netVolume: string
  skinType: string
  finishType: string
  rating: number
  reviewCount: number
  isBestSeller?: boolean
  isNewArrival?: boolean
  isFeatured?: boolean
  image: string
  keyBenefits: string[]
  ingredients: string
  howToUse: string
  hasShades?: boolean
  shades?: Array<{
    shadeName: string
    colorHex: string
    sku: string
  }>
}

export interface CosmeticCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  itemCount: number
}

export const COSMETIC_CATEGORIES: CosmeticCategory[] = [
  {
    id: 'cat-1',
    name: 'Lip Care & Colors',
    slug: 'lips',
    description: 'Velvet matte lipsticks, tinted glosses & plumping lip oils',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
    itemCount: 14,
  },
  {
    id: 'cat-2',
    name: 'Radiance Skincare',
    slug: 'skincare',
    description: 'Niacinamide serums, hyaluronic creams & barrier repair',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    itemCount: 18,
  },
  {
    id: 'cat-3',
    name: 'Eyes & Brows',
    slug: 'eyes',
    description: 'Waterproof gel eyeliners, lash volumizing mascaras & shadow palettes',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    itemCount: 12,
  },
  {
    id: 'cat-4',
    name: 'Face & Complexion',
    slug: 'face',
    description: 'Featherlight foundations, luminous blushes & setting powders',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    itemCount: 16,
  },
  {
    id: 'cat-5',
    name: 'Sun Protection (SPF)',
    slug: 'sunscreen',
    description: 'Invisible fluid sunscreen with SPF 50+ PA++++ and zero white cast',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    itemCount: 8,
  },
  {
    id: 'cat-6',
    name: 'Gift Sets & Combos',
    slug: 'combos',
    description: 'Curated luxury beauty kits & festive hampers at special prices',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    itemCount: 6,
  },
  {
    id: 'cat-7',
    name: 'Hair & Scalp Care',
    slug: 'haircare',
    description: 'Rosemary & Methi Dana anti-hairfall shampoo, nourishing oils & hair care',
    image: '/images/hero-banner.png',
    itemCount: 8,
  },
]

export const COSMETIC_PRODUCTS: CosmeticProduct[] = [
  {
    id: 'prod-hair-1',
    title: 'Rosemary & Methi Dana Hair Shampoo',
    slug: 'rosemary-methi-dana-hair-shampoo',
    tagline: 'Advanced Hairfall Control & Scalp Nourishment with Natural Actives',
    category: { name: 'Hair & Scalp Care', slug: 'haircare' },
    price: 499,
    compareAtPrice: 699,
    netVolume: '200 ml / 6.76 fl. oz.',
    skinType: 'All Hair Types (Colour Safe)',
    finishType: 'Silky, Strong & Frizz-Free',
    rating: 4.95,
    reviewCount: 482,
    isBestSeller: true,
    isNewArrival: true,
    isFeatured: true,
    image: '/images/hero-banner.png',
    keyBenefits: [
      'Reduces Hair Fall & Breakage',
      'Deeply Nourishes & Stimulates Scalp',
      'Soft & Smooth, Tangle-Free Hair',
      '100% Sulphate, Paraben & Toxin Free',
    ],
    ingredients: 'Pure Rosemary Extract, Methi Dana (Fenugreek) Oil, Biotin, Plant Keratin, Aqua, Aloe Barbadensis Leaf Juice, Vitamin E.',
    howToUse: 'Apply to wet hair, massage gently into scalp creating rich lather for 1-2 minutes, rinse thoroughly with clean water.',
  },
  {
    id: 'prod-1',
    title: 'Velvet Luxe Matte Lipstick',
    slug: 'velvet-luxe-matte-lipstick',
    tagline: '16H Transfer-Proof Hydrating Formula with Jojoba Oil',
    category: { name: 'Lip Care & Colors', slug: 'lips' },
    price: 699,
    compareAtPrice: 999,
    netVolume: '3.8 g',
    skinType: 'All Skin Types',
    finishType: 'Velvet Matte',
    rating: 4.9,
    reviewCount: 248,
    isBestSeller: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
    keyBenefits: ['16-Hour Stay', 'Transfer-Proof & Non-Drying', 'Enriched with Vitamin E & Jojoba', '100% Vegan & Cruelty-Free'],
    ingredients: 'Dimethicone, Jojoba Seed Oil, Vitamin E Acetate, Shea Butter, Food-grade Mineral Pigments.',
    howToUse: 'Glide directly across top and bottom lips. For extra definition, outline with lip liner first.',
    hasShades: true,
    shades: [
      { shadeName: '01 - Ruby Romance', colorHex: '#8B1E2F', sku: 'LVX-LIP-01' },
      { shadeName: '02 - Velvet Nude', colorHex: '#B57367', sku: 'LVX-LIP-02' },
      { shadeName: '03 - Plum Seduction', colorHex: '#5C1D38', sku: 'LVX-LIP-03' },
      { shadeName: '04 - Peach Kiss', colorHex: '#D6806C', sku: 'LVX-LIP-04' },
      { shadeName: '05 - Espresso Mocha', colorHex: '#4A2A22', sku: 'LVX-LIP-05' },
    ],
  },
  {
    id: 'prod-2',
    title: 'Glow Radiance 10% Niacinamide Serum',
    slug: 'glow-radiance-niacinamide-serum',
    tagline: 'Dark Spot Corrector & Skin Barrier Strengthener with Zinc PCA',
    category: { name: 'Radiance Skincare', slug: 'skincare' },
    price: 849,
    compareAtPrice: 1199,
    netVolume: '30 ml / 1.0 fl. oz.',
    skinType: 'Oily & Combination Skin',
    finishType: 'Dewy & Glowing',
    rating: 4.8,
    reviewCount: 312,
    isBestSeller: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    keyBenefits: ['Fades Blemishes & Dark Spots', 'Regulates Sebum & Tightens Pores', 'Centella Asiatica Soothing Agent', 'Dermatologically Tested'],
    ingredients: 'Pure Niacinamide (10%), Zinc PCA (1%), Hyaluronic Acid, Centella Asiatica Extract, Aqua.',
    howToUse: 'Apply 3-4 drops to cleansed face morning and night before heavier moisturizers.',
  },
  {
    id: 'prod-3',
    title: 'Invisible Shield Dewy Sunscreen SPF 50+',
    slug: 'invisible-shield-dewy-sunscreen-spf50',
    tagline: 'Ultra-Lightweight PA++++ Broad Spectrum Sun Guard with Cica',
    category: { name: 'Sun Protection (SPF)', slug: 'sunscreen' },
    price: 599,
    compareAtPrice: 799,
    netVolume: '50 g / 1.76 oz.',
    skinType: 'All Skin Types (Acne-Safe)',
    finishType: 'Natural Glow',
    rating: 4.9,
    reviewCount: 420,
    isBestSeller: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    keyBenefits: ['Zero White Cast', 'Non-Greasy & Fast Absorbing', 'Blue Light & Pollution Defense', 'Water & Sweat Resistant'],
    ingredients: 'UV Filters (Tinosorb M, Uvinul A Plus), Cica Extract, Green Tea, Hyaluronic Acid.',
    howToUse: 'Apply liberally 15 minutes before sun exposure as the final step of your morning skincare routine.',
  },
  {
    id: 'prod-4',
    title: 'Silk Touch Breathable Serum Foundation',
    slug: 'silk-touch-serum-foundation',
    tagline: 'Medium-to-Full Buildable Coverage Infused with Hyaluronic Acid',
    category: { name: 'Face & Complexion', slug: 'face' },
    price: 999,
    compareAtPrice: 1399,
    netVolume: '30 ml / 1.0 fl. oz.',
    skinType: 'All Skin Types',
    finishType: 'Satin Silk',
    rating: 4.7,
    reviewCount: 184,
    isNewArrival: true,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    keyBenefits: ['Second-Skin Natural Finish', 'Hydrates while Giving Flawless Coverage', 'Transfer-Resistant for 12 Hours', 'Non-Comedogenic'],
    ingredients: 'Water, Cyclopentasiloxane, Hyaluronic Acid, Squalane, Peptide Complex, Iron Oxides.',
    hasShades: true,
    shades: [
      { shadeName: '01 - Fair Ivory', colorHex: '#F3DFC8', sku: 'LVX-FND-01' },
      { shadeName: '02 - Warm Beige', colorHex: '#E2BC9B', sku: 'LVX-FND-02' },
      { shadeName: '03 - Honey Almond', colorHex: '#C99E78', sku: 'LVX-FND-03' },
      { shadeName: '04 - Caramel Tan', colorHex: '#A6744E', sku: 'LVX-FND-04' },
      { shadeName: '05 - Deep Toffee', colorHex: '#7C4B2E', sku: 'LVX-FND-05' },
    ],
    howToUse: 'Pump 1-2 drops onto the back of your hand. Blend outward from the center of face with sponge or brush.',
  },
  {
    id: 'prod-5',
    title: 'Hydra-Plump Glaze Lip Oil',
    slug: 'hydra-plump-glaze-lip-oil',
    tagline: 'High-Shine Tinted Treatment with Tripeptide & Rosehip Oil',
    category: { name: 'Lip Care & Colors', slug: 'lips' },
    price: 549,
    compareAtPrice: 749,
    netVolume: '6.5 ml / 0.22 fl. oz.',
    skinType: 'Dry & Chapped Lips',
    finishType: 'Glassy Shine',
    rating: 4.9,
    reviewCount: 195,
    isNewArrival: true,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    keyBenefits: ['Instantly Plumps & Nourishes', 'Non-Sticky Cushion Feel', 'Subtle Natural Tint', 'Enriched with Rosehip & Coconut Oil'],
    ingredients: 'Polybutene, Rosehip Seed Oil, Coconut Oil, Palmitoyl Tripeptide-1, Vitamin E.',
    hasShades: true,
    shades: [
      { shadeName: 'Glazed Clear', colorHex: '#FFF5F0', sku: 'LVX-OIL-01' },
      { shadeName: 'Berry Crush', colorHex: '#B2224A', sku: 'LVX-OIL-02' },
      { shadeName: 'Peachy Glow', colorHex: '#FF8770', sku: 'LVX-OIL-03' },
    ],
    howToUse: 'Apply generously with the plush doe-foot applicator alone or over your favorite lipstick for a mirror glaze.',
  },
  {
    id: 'prod-6',
    title: 'Midnight Sculpt 24H Waterproof Gel Liner',
    slug: 'midnight-sculpt-waterproof-gel-liner',
    tagline: 'Intense Jet-Black Precision with Smudge-Proof Wax Matrix',
    category: { name: 'Eyes & Brows', slug: 'eyes' },
    price: 449,
    compareAtPrice: 599,
    netVolume: '1.2 g',
    skinType: 'Sensitive Eyes & Contact Lens Safe',
    finishType: 'Deep Matte Black',
    rating: 4.8,
    reviewCount: 210,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    keyBenefits: ['24H Smudge-Proof & Waterproof', 'Ultra-Creamy One-Stroke Glide', 'Safe for Waterline & Sensitive Eyes', 'Built-in Sharpener'],
    ingredients: 'Isododecane, Synthetic Wax, Castor Oil, Vitamin E, Carbon Black Pigment.',
    howToUse: 'Trace along your upper lash line from inner to outer corner. For a winged look, flick slightly upward at the outer corner.',
  },
]
