import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    group: 'Website Content',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user && user.role !== 'customer'),
  },
  fields: [
    // 1. HERO CAROUSEL
    {
      name: 'heroSlides',
      type: 'array',
      label: 'Homepage Hero Carousel Slides',
      admin: {
        description: 'Manage slides for the main homepage hero banner',
      },
      fields: [
        { name: 'badge', type: 'text', label: 'Top Pill Badge', defaultValue: 'AYURVEDIC BOTANICAL SCIENCE' },
        { name: 'heading', type: 'text', required: true, label: 'Main Headline', defaultValue: 'Embrace Your Natural Beauty' },
        { name: 'highlightHeading', type: 'text', label: 'Highlight Headline Text', defaultValue: 'Everyday Hair Care Essentials' },
        { name: 'subheading', type: 'textarea', label: 'Subtitle / Description', defaultValue: 'Thoughtfully crafted with time-tested botanical oils and clarifying plant extracts for soft, resilient, naturally radiant hair.' },
        { name: 'ctaText', type: 'text', label: 'Primary CTA Button Text', defaultValue: 'EXPLORE OUR RITUALS' },
        { name: 'ctaLink', type: 'text', label: 'Primary CTA URL', defaultValue: '/products' },
        { name: 'secondaryCtaText', type: 'text', label: 'Secondary CTA Button Text', defaultValue: 'OUR BOTANICAL PHILOSOPHY' },
        { name: 'secondaryCtaLink', type: 'text', label: 'Secondary CTA URL', defaultValue: '/about' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Slide Image (Upload)' },
        { name: 'imageUrl', type: 'text', label: 'Fallback Image Path (e.g. /images/lovixa-hero-banner-products.jpg)' },
      ],
    },

    // 2. FEATURED PRODUCTS
    {
      name: 'featuredProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Featured Products in "Top Hair Care Picks"',
    },

    // 3. WHY LOVIXA
    {
      name: 'whyChooseUs',
      type: 'group',
      label: 'The LOVIXA Purity Standard Section',
      fields: [
        { name: 'heading', type: 'text', label: 'Heading', defaultValue: 'The LOVIXA Purity Standard' },
        { name: 'subtitle', type: 'text', label: 'Subtitle', defaultValue: 'Time-honored Ayurvedic wisdom married with modern clean cosmetic science — uncompromised botanical integrity' },
        {
          name: 'pillars',
          type: 'array',
          label: 'Value Pillars (Cards)',
          fields: [
            {
              name: 'iconType',
              type: 'select',
              options: [
                { label: 'Clean (Leaf)', value: 'clean' },
                { label: 'Conscious (Spark/Bulb)', value: 'conscious' },
                { label: 'Effective (Heart/People)', value: 'effective' },
              ],
              defaultValue: 'clean',
            },
            { name: 'title', type: 'text', required: true, label: 'Pillar Title (e.g. CLEAN)' },
            { name: 'desc', type: 'textarea', required: true, label: 'Description' },
          ],
        },
      ],
    },

    // 4. SOLVE YOUR CONCERN -> TARGETED RITUALS BY HAIR NEED
    {
      name: 'concernsSection',
      type: 'group',
      label: 'Targeted Rituals by Hair Need Section',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Eyebrow Tag', defaultValue: 'TARGETED BOTANICAL CARE' },
        { name: 'heading', type: 'text', label: 'Section Title', defaultValue: 'Targeted Rituals for Every Hair Need' },
        { name: 'subtitle', type: 'text', label: 'Subtitle', defaultValue: 'Select your primary hair goal to explore the dedicated two-step restorative Ayurvedic regimen' },
        {
          name: 'concerns',
          type: 'array',
          label: 'Hair Concern Cards & Routines',
          fields: [
            { name: 'concernId', type: 'text', label: 'Unique ID (e.g. hair-fall)', required: true },
            { name: 'title', type: 'text', label: 'Concern Title (e.g. Hair Fall & Breakage)', required: true },
            { name: 'subtitle', type: 'text', label: 'Sub-badge (e.g. 2 products • Full Duo Routine)' },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Concern Image (Upload)' },
            { name: 'imageUrl', type: 'text', label: 'Fallback Image Path (e.g. /images/concern-hairfall.jpg)' },
            { name: 'routineTitle', type: 'text', label: 'Routine Modal Title' },
            { name: 'routineDesc', type: 'textarea', label: 'Routine Modal Description' },
            {
              name: 'steps',
              type: 'array',
              label: 'Routine Steps',
              fields: [
                { name: 'stepText', type: 'text', required: true, label: 'Step Instruction' },
              ],
            },
            { name: 'productTitle', type: 'text', label: 'Recommended Product Title' },
            { name: 'productImage', type: 'upload', relationTo: 'media', label: 'Recommended Product Image' },
            { name: 'productImageUrl', type: 'text', label: 'Recommended Product Image Path' },
            { name: 'price', type: 'number', label: 'Price' },
            { name: 'compareAtPrice', type: 'number', label: 'Compare at Price' },
            { name: 'slug', type: 'text', label: 'Product Slug' },
            { name: 'productId', type: 'text', label: 'Product ID' },
          ],
        },
      ],
    },

    // 5. SIGNATURE COMBO BUNDLE DEAL
    {
      name: 'promoBanner',
      type: 'group',
      label: 'Signature Combo Bundle Deal Banner (The Complete Hair Care Duo)',
      fields: [
        { name: 'sectionTitle', type: 'text', label: 'Section Heading', defaultValue: 'The Essential Scalp & Strand Ritual Duo' },
        { name: 'sectionSubtitle', type: 'text', label: 'Section Subtitle', defaultValue: 'Combine our Botanical Cleanser and Cold-Pressed Scalp Elixir for lasting flake defense, root strength, and mirror gloss' },
        { name: 'badge', type: 'text', label: 'Badge', defaultValue: 'SIGNATURE CEREMONY SET' },
        { name: 'ritualTitle', type: 'text', label: 'Ritual Step Tag', defaultValue: 'TWO-STEP RESTORATIVE CEREMONY' },
        { name: 'productTitle', type: 'text', label: 'Product Bundle Title', defaultValue: 'Botanical Shampoo (500ml) + Hair Oil (50ml)' },
        { name: 'description', type: 'textarea', label: 'Description', defaultValue: 'The ultimate Ayurvedic hair ritual. Deeply purifies scalp pores with gentle plant surfactants while locking in root nutrients for lasting softness and hair fall resistance.' },
        {
          name: 'features',
          type: 'array',
          label: 'Bullet Points',
          fields: [
            { name: 'text', type: 'text', required: true, label: 'Feature Point' },
          ],
        },
        { name: 'offerPrice', type: 'number', label: 'Offer Price', defaultValue: 549 },
        { name: 'comparePrice', type: 'number', label: 'Original Price', defaultValue: 699 },
        { name: 'discountTag', type: 'text', label: 'Discount Tag', defaultValue: 'Save 21%' },
        { name: 'ctaText', type: 'text', label: 'Button CTA Text', defaultValue: 'ADD COMPLETE DUO TO BAG' },
        { name: 'ctaLink', type: 'text', label: 'Button URL', defaultValue: '/products/lovixa-hair-care-duo' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Bundle Image (Upload)' },
        { name: 'imageUrl', type: 'text', label: 'Fallback Image Path (e.g. /images/lovixa-duo.jpg)' },
        { name: 'freeShippingText', type: 'text', label: 'Free Shipping Note', defaultValue: 'Free Express Shipping Included' },
        { name: 'trustText', type: 'text', label: 'Trust Note', defaultValue: '100% Authentic Ayurvedic' },
      ],
    },

    // 6. REAL EXPERIENCE VIDEO REELS -> REAL RITUALS, VISIBLE TRANSFORMATIONS
    {
      name: 'realExperience',
      type: 'group',
      label: 'Real Rituals & Customer Stories',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading', defaultValue: 'Real Rituals, Visible Transformations' },
        { name: 'subtitle', type: 'text', label: 'Section Subtitle', defaultValue: 'Authentic hair journeys, daily rituals, and unfiltered results shared by our loyal community' },
        {
          name: 'reels',
          type: 'array',
          label: 'Customer Video Cards',
          fields: [
            { name: 'title', type: 'text', label: 'Reel Title', required: true },
            { name: 'customerName', type: 'text', label: 'Customer Name & City', required: true },
            { name: 'views', type: 'text', label: 'View Count (e.g. 2.5k)', defaultValue: '2.5k' },
            { name: 'thumbnail', type: 'upload', relationTo: 'media', label: 'Thumbnail Image (Upload)' },
            { name: 'thumbnailUrl', type: 'text', label: 'Fallback Thumbnail Path' },
            { name: 'productTitle', type: 'text', label: 'Featured Product Title', required: true },
            { name: 'productImage', type: 'upload', relationTo: 'media', label: 'Product Image (Upload)' },
            { name: 'productImageUrl', type: 'text', label: 'Fallback Product Image Path' },
            { name: 'productSlug', type: 'text', label: 'Product Slug', required: true },
            { name: 'price', type: 'number', label: 'Price', required: true },
            { name: 'compareAtPrice', type: 'number', label: 'Compare at Price' },
            { name: 'discount', type: 'text', label: 'Discount Tag (e.g. 15% OFF)', defaultValue: '15% OFF' },
          ],
        },
      ],
    },

    // 7. BEYOND ONE KIND OF CARE -> THOUGHTFULLY FORMULATED FOR EVERY STRAND
    {
      name: 'categoryPedestals',
      type: 'group',
      label: 'Botanical Categories Section',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading', defaultValue: 'Thoughtfully Formulated For Every Strand' },
        { name: 'subtitle', type: 'text', label: 'Section Subtitle', defaultValue: 'From clarifying washes to cold-pressed scalp oils, discover the purposeful rituals crafted for your hair' },
        {
          name: 'cards',
          type: 'array',
          label: 'Category Pedestal Cards',
          fields: [
            { name: 'tag', type: 'text', label: 'Top Tag', defaultValue: 'LOVIXA ESSENTIAL' },
            { name: 'title', type: 'text', label: 'Title (e.g. HAIR CARE)', required: true },
            { name: 'subtitle', type: 'text', label: 'Subtitle', required: true },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Card Image (Upload)' },
            { name: 'imageUrl', type: 'text', label: 'Fallback Image Path' },
            { name: 'href', type: 'text', label: 'Link URL (e.g. /products)', required: true },
          ],
        },
      ],
    },

    // 8. THE LOVIXA PHILOSOPHY & TRUST BADGES
    {
      name: 'brandStory',
      type: 'group',
      label: 'The LOVIXA Botanical Heritage & Trust Seals',
      fields: [
        { name: 'heading', type: 'text', label: 'Section Heading', defaultValue: 'The LOVIXA Botanical Heritage' },
        { name: 'storyText', type: 'textarea', label: 'Editorial Story Text', defaultValue: 'At LOVIXA, we believe your hair care goes beyond what you see in the mirror — and deserves mindful self-care that goes deeper to the roots. We bring you thoughtful, time-honored Ayurvedic botanical solutions that nurture your scalp with trust, cold-pressed purity, and dermatologically tested clinical efficacy.' },
        {
          name: 'seals',
          type: 'array',
          label: 'Trust Seals (4 Circular Badges)',
          fields: [
            {
              name: 'iconType',
              type: 'select',
              options: [
                { label: 'Leaf (100% Ayurvedic)', value: 'leaf' },
                { label: 'Award (AYUSH Certified)', value: 'award' },
                { label: 'Shield (Dermatologist Safe)', value: 'shield' },
                { label: 'Heart (100% Cruelty-Free)', value: 'heart' },
              ],
              defaultValue: 'leaf',
            },
            { name: 'title', type: 'text', label: 'Badge Title', required: true },
            { name: 'subtitle', type: 'text', label: 'Badge Sub-label', required: true },
            { name: 'desc', type: 'textarea', label: 'Short Description', required: true },
          ],
        },
      ],
    },

    // 9. FAQS
    {
      name: 'faqs',
      type: 'group',
      label: 'Customer Guidance & FAQs Section',
      fields: [
        { name: 'heading', type: 'text', label: 'Heading', defaultValue: 'Hair Ritual & Care Guidance' },
        { name: 'subtitle', type: 'text', label: 'Subtitle', defaultValue: 'Everything you need to know about our botanical sourcing, usage rituals, and mindful delivery' },
        {
          name: 'items',
          type: 'array',
          label: 'FAQ Accordion Items',
          fields: [
            { name: 'question', type: 'text', required: true, label: 'Question' },
            { name: 'answer', type: 'textarea', required: true, label: 'Answer' },
          ],
        },
      ],
    },

    // 10. COMMUNITY & VIP CLUB
    {
      name: 'community',
      type: 'group',
      label: 'The LOVIXA Collective & Privilege Circle',
      fields: [
        { name: 'heading', type: 'text', label: 'Instagram Section Heading', defaultValue: 'Moments of Botanical Self-Care' },
        { name: 'subtitle', type: 'text', label: 'Instagram Subtitle', defaultValue: 'Share your daily hair ceremonies and tag @lovixa_cosmetic to be featured in our botanical gallery' },
        { name: 'vipBadge', type: 'text', label: 'VIP Club Badge', defaultValue: 'THE LOVIXA PRIVILEGE CIRCLE' },
        { name: 'vipTitle', type: 'text', label: 'VIP Club Title', defaultValue: 'Join Our Community for Exclusive Offers' },
        { name: 'vipSubtitle', type: 'textarea', label: 'VIP Club Subtitle', defaultValue: 'Connect with our official WhatsApp community to receive your personal welcome discount voucher directly on your phone.' },
        { name: 'vipCode', type: 'text', label: 'Voucher Code (Optional)' },
        {
          name: 'galleryImages',
          type: 'array',
          label: 'Instagram Lookbook Images',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Image (Upload)' },
            { name: 'imageUrl', type: 'text', label: 'Fallback Image Path' },
            { name: 'caption', type: 'text', label: 'Caption' },
          ],
        },
      ],
    },
  ],
}
