import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function seedEcommerce() {
  console.log('🌱 Seeding LOVIXA COSMETIC E-Commerce Store...')

  try {
    const payload = await getPayload({ config })

    // 1. Seed Admin User (Dynamic via .env)
    const adminEmail = process.env.ADMIN_EMAIL?.trim() || 'lovixacosmetic@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD?.trim() || 'LovixaCosmetic@2026!'
    const adminName = process.env.ADMIN_NAME?.trim() || 'LOVIXA Store Administrator'

    console.log(`→ Seeding Admin User (${adminEmail})...`)
    const existingAdmin = await payload.find({
      collection: 'users',
      where: { email: { equals: adminEmail } },
    })

    if (existingAdmin.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
          role: 'admin',
        },
      })
      console.log(`  ✓ Admin created: ${adminEmail}`)
    } else {
      await payload.update({
        collection: 'users',
        id: existingAdmin.docs[0].id,
        data: {
          password: adminPassword,
          name: adminName,
          role: 'admin',
        },
      })
      console.log(`  ✓ Admin already exists, updated credentials for: ${adminEmail}`)
    }

    // 2. Seed Store Settings
    console.log('→ Seeding Store Settings...')
    await payload.updateGlobal({
      slug: 'store-settings',
      data: {
        storeName: 'LOVIXA COSMETIC',
        currency: {
          code: 'INR',
          symbol: '₹',
          baseValue: 1,
          decimals: 2,
        },
        supportedCurrencies: [
          { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 1 },
          { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 0.012 },
          { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.011 },
          { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.0095 },
        ],
        shipping: {
          flatRate: 99,
          freeShippingThreshold: 999,
          freeShippingEnabled: true,
        },
        tax: {
          enabled: true,
          ratePercentage: 18.0,
          pricesIncludeTax: true,
          taxLabel: 'GST (Inclusive)',
        },
        gateways: {
          enableStripe: true,
          enableRazorpay: true,
          enableCashOnDelivery: true,
        },
      },
    })

    // 3. Seed SEO Settings
    console.log('→ Seeding SEO Settings...')
    await payload.updateGlobal({
      slug: 'seo-settings',
      data: {
        siteTitle: 'LOVIXA COSMETIC | Pure Botanical Hair Wellness',
        titleSeparator: '—',
        defaultMetaDescription:
          'Discover LOVIXA Ayurvedic Shampoo (500ml) & Cold-Pressed Hair Oil (50ml). Thoughtfully crafted, nature-inspired hair care essentials.',
        keywords:
          'botanical shampoo, ayurvedic hair oil, sulfate free clarifying shampoo, hair fall control oil, anti-frizz hair ritual, rosemary scalp care, LOVIXA cosmetic',
        canonicalBaseUrl: 'https://lovixacosmetic.com',
        organization: {
          name: 'LOVIXA COSMETIC',
          legalName: 'LOVIXA COSMETIC',
          contactEmail: 'lovixacosmetic@gmail.com',
          contactPhone: '+91 97124 60509',
          addressCountry: 'IN',
          instagramUrl: 'https://www.instagram.com/lovixa_cosmetic',
          facebookUrl: 'https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/',
        },
      },
    })

    // 4. Seed Announcement Bar
    console.log('→ Seeding Announcement Bar...')
    await payload.updateGlobal({
      slug: 'announcement-bar',
      data: {
        enabled: true,
        backgroundColor: '#1F141A',
        textColor: '#FFFFFF',
        messages: [
          {
            text: 'FREE PAN-INDIA EXPRESS SHIPPING ON ALL ORDERS OVER ₹999',
            highlight: 'FREE SHIPPING',
            link: '/products',
          },
          {
            text: 'NEW CUSTOMER WELCOME: USE CODE FOR 15% OFF YOUR FIRST RITUAL',
            highlight: 'LOVIXA15',
            link: '/products',
          },
          {
            text: '100% PURE BOTANICAL EXTRACTS • CRUELTY-FREE • AYURVEDIC FORMULATION',
            highlight: '100% BOTANICAL',
          },
        ],
      },
    })

    // 5. Seed Homepage Global
    console.log('→ Seeding Homepage Global...')
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        heroSlides: [
          {
            badge: 'AYURVEDIC BOTANICAL SCIENCE',
            heading: 'Embrace Your Natural Beauty',
            highlightHeading: 'Everyday Hair Care Essentials',
            subheading:
              'Thoughtfully crafted with time-tested botanical oils and clarifying plant extracts for soft, resilient, naturally radiant hair.',
            ctaText: 'EXPLORE OUR RITUALS',
            ctaLink: '/products',
            secondaryCtaText: 'OUR BOTANICAL PHILOSOPHY',
            secondaryCtaLink: '/about',
            imageUrl: '/images/lovixa-hero-banner-products.jpg',
          },
          {
            badge: 'COLD-PRESSED ELIXIRS',
            heading: 'Nourishing Hair Oil & Shampoo',
            highlightHeading: 'Root-to-Tip Rejuvenation',
            subheading:
              'Experience the pure goodness of cold-pressed botanicals formulated to nourish hair strands and calm the scalp.',
            ctaText: 'SHOP THE COLLECTION',
            ctaLink: '/products',
            secondaryCtaText: 'VIEW RITUAL DUO',
            secondaryCtaLink: '/products/lovixa-hair-care-duo',
            imageUrl: '/images/lovixa-hero-banner-model.jpg',
          },
        ],
        whyChooseUs: {
          heading: 'Why LOVIXA?',
          subtitle: 'Thoughtfully crafted Ayurvedic hair essentials made with botanical integrity',
          pillars: [
            {
              iconType: 'clean',
              title: 'CLEAN',
              desc: 'Pure cold-pressed botanicals without sulfates, parabens, mineral oils, or synthetic silicones.',
            },
            {
              iconType: 'conscious',
              title: 'CONSCIOUS',
              desc: 'Cruelty-free, vegan formulations thoughtfully created with reverence for Ayurvedic heritage.',
            },
            {
              iconType: 'effective',
              title: 'EFFECTIVE',
              desc: 'Dermatologically evaluated, visible scalp balancing and hair strength results you can feel.',
            },
          ],
        },
        concernsSection: {
          eyebrow: 'SHOP BY CONCERN',
          heading: 'Solve Your Concern',
          subtitle: 'Tap one to explore the targeted 2-step Ayurvedic routine',
          concerns: [
            {
              concernId: 'hair-fall',
              title: 'Hair Fall & Breakage',
              subtitle: '2 products • Full Duo Routine',
              imageUrl: '/images/concern-hairfall.jpg',
              routineTitle: 'Root Strengthening & Anti-Breakage Routine',
              routineDesc:
                'Formulated with Bhringraj, Rosemary & Botanical extracts to reinforce weak follicles, reduce shower fall, and strengthen strand tensile grip.',
              steps: [
                { stepText: 'Step 1: Warm 4-5 drops of Hair Oil and gently massage into scalp roots for 10 minutes.' },
                { stepText: 'Step 2: Wash with LOVIXA Refreshing Shampoo to cleanse without stripping natural oils.' },
                { stepText: 'Step 3: Repeat 3x weekly for visible density and reduced breakage within 21 days.' },
              ],
              productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
              productImageUrl: '/images/lovixa-duo.jpg',
              price: 46.0,
              compareAtPrice: 52.0,
              slug: 'lovixa-hair-care-duo',
              productId: 'prod_duo',
            },
            {
              concernId: 'dandruff-scalp',
              title: 'Dandruff & Flakes',
              subtitle: '2 products • Full Duo Routine',
              imageUrl: '/images/concern-dandruff.jpg',
              routineTitle: 'Scalp Balancing & Flake Relief Routine',
              routineDesc:
                'Deeply clears micro-buildup and soothes itchy, dry flakes while balancing the scalp microbiome with gentle botanical surfactants.',
              steps: [
                { stepText: 'Step 1: Pre-wash scalp soothing with lightweight Botanical Hair Oil 20 mins prior.' },
                { stepText: 'Step 2: Lather LOVIXA Shampoo into scalp focusing on crown and temples.' },
                { stepText: 'Step 3: Rinse with lukewarm water to reveal a clean, refreshed, breathable scalp.' },
              ],
              productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
              productImageUrl: '/images/lovixa-duo.jpg',
              price: 46.0,
              compareAtPrice: 52.0,
              slug: 'lovixa-hair-care-duo',
              productId: 'prod_duo',
            },
            {
              concernId: 'dry-frizzy',
              title: 'Dry & Frizzy Hair',
              subtitle: '2 products • Full Duo Routine',
              imageUrl: '/images/concern-frizzy.jpg',
              routineTitle: 'Hydration Locking & Frizz Control Routine',
              routineDesc:
                'Seals moisture directly into coarse, open cuticles to tame humidity flyaways and restore touchable, bouncy softness.',
              steps: [
                { stepText: 'Step 1: Cleanse with LOVIXA Botanical Shampoo for gentle hydration.' },
                { stepText: 'Step 2: On damp ends, apply 2 drops of Hair Oil as a lightweight leave-in serum.' },
                { stepText: 'Step 3: Air dry or blow dry on cool setting for smooth, mirror-like gloss.' },
              ],
              productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
              productImageUrl: '/images/lovixa-duo.jpg',
              price: 46.0,
              compareAtPrice: 52.0,
              slug: 'lovixa-hair-care-duo',
              productId: 'prod_duo',
            },
            {
              concernId: 'damaged-splitends',
              title: 'Damaged & Split Ends',
              subtitle: '2 products • Full Duo Routine',
              imageUrl: '/images/concern-splitends.jpg',
              routineTitle: 'Intense Cuticle Repair Routine',
              routineDesc:
                'Deep lipid restoration for heat-treated and chemically stressed strands, binding frayed split ends and preventing future friction damage.',
              steps: [
                { stepText: 'Step 1: Overnight deep saturation of mid-lengths to ends with Cold-Pressed Hair Oil.' },
                { stepText: 'Step 2: Morning rinse with sulfate-free LOVIXA Shampoo to preserve natural keratin.' },
                { stepText: 'Step 3: Enjoy noticeably softer, tangle-free ends with zero brittleness.' },
              ],
              productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
              productImageUrl: '/images/lovixa-duo.jpg',
              price: 46.0,
              compareAtPrice: 52.0,
              slug: 'lovixa-hair-care-duo',
              productId: 'prod_duo',
            },
          ],
        },
        promoBanner: {
          badge: 'SAVE 15% COMBO DEAL',
          sectionTitle: 'The Complete Hair Care Duo',
          sectionSubtitle:
            'Pair our Botanical Shampoo & Nourishing Hair Oil for clarifying scalp freshness and all-day frizz control',
          ritualTitle: '2-STEP DAILY RITUAL',
          productTitle: 'Botanical Shampoo (500ml) + Hair Oil (50ml)',
          description:
            'The ultimate Ayurvedic hair ritual. Deeply purifies scalp pores with gentle plant surfactants while locking in root nutrients for lasting softness and hair fall resistance.',
          features: [
            { text: 'Gentle daily cleanse maintains natural scalp moisture barrier' },
            { text: 'Cold-pressed Bhringraj & Rosemary strengthen follicle grip' },
            { text: '100% Ayurvedic • Zero Sulfates • Dermatologically Approved' },
          ],
          offerPrice: 46.0,
          comparePrice: 52.0,
          discountTag: 'Save 15%',
          ctaText: 'ADD COMPLETE DUO TO BAG',
          ctaLink: '/products/lovixa-hair-care-duo',
          imageUrl: '/images/lovixa-duo.jpg',
          freeShippingText: 'Free Shipping Included',
          trustText: '100% Authentic Ayurvedic',
        },
        realExperience: {
          heading: 'Real Experience',
          subtitle: 'Real customers sharing their unfiltered Ayurvedic hair transformations',
          reels: [
            {
              title: 'My 14-Day Shampoo Transformation',
              customerName: 'Priya S., Mumbai',
              views: '2.5k',
              thumbnailUrl: '/images/reel-1.jpg',
              productTitle: 'LOVIXA Botanical Refreshing Shampoo',
              productImageUrl: '/images/lovixa-shampoo.jpg',
              productSlug: 'lovixa-shampoo',
              price: 24.0,
              compareAtPrice: 28.0,
              discount: '15% OFF',
            },
            {
              title: 'How I Apply Hair Oil for Root Growth',
              customerName: 'Ananya M., Delhi',
              views: '3.8k',
              thumbnailUrl: '/images/reel-2.jpg',
              productTitle: 'LOVIXA Nourishing Hair Oil (50ml)',
              productImageUrl: '/images/lovixa-hairoil.jpg',
              productSlug: 'lovixa-hair-oil',
              price: 28.0,
              compareAtPrice: 34.0,
              discount: '18% OFF',
            },
            {
              title: 'Say Goodbye to Frizz & Scalp Flakes',
              customerName: 'Kavita R., Ahmedabad',
              views: '1.9k',
              thumbnailUrl: '/images/lovixa-insta-1.jpg',
              productTitle: 'LOVIXA Complete Hair Care Duo Set',
              productImageUrl: '/images/lovixa-duo.jpg',
              productSlug: 'lovixa-hair-care-duo',
              price: 46.0,
              compareAtPrice: 52.0,
              discount: '15% OFF',
            },
            {
              title: 'The Best Ayurvedic Scalp Massage Ritual',
              customerName: 'Sneha P., Bengaluru',
              views: '4.2k',
              thumbnailUrl: '/images/lovixa-insta-2.jpg',
              productTitle: 'LOVIXA Nourishing Hair Oil (50ml)',
              productImageUrl: '/images/lovixa-hairoil.jpg',
              productSlug: 'lovixa-hair-oil',
              price: 28.0,
              compareAtPrice: 34.0,
              discount: '18% OFF',
            },
            {
              title: 'Unboxing My Daily Essentials Kit',
              customerName: 'Rhea D., Pune',
              views: '2.1k',
              thumbnailUrl: '/images/lovixa-insta-3.jpg',
              productTitle: 'LOVIXA Hair Care Duo (Shampoo + Oil)',
              productImageUrl: '/images/lovixa-duo.jpg',
              productSlug: 'lovixa-hair-care-duo',
              price: 46.0,
              compareAtPrice: 52.0,
              discount: '15% OFF',
            },
          ],
        },
        categoryPedestals: {
          heading: 'Beyond One Kind Of Care',
          subtitle: 'Handpicked solutions for every hair type and daily care ritual',
          cards: [
            {
              tag: 'BEYOND ONE OPTION!',
              title: 'HAIR CARE',
              subtitle: '10+ CONCERN BASED HAIR-CARE PRODUCTS',
              imageUrl: '/images/lovixa-hero-banner-products.jpg',
              href: '/products',
            },
            {
              tag: 'BEYOND ONE OPTION!',
              title: 'HAIR OILS',
              subtitle: 'COLD-PRESSED NUTRIENT RICH SCALP ELIXIRS',
              imageUrl: '/images/lovixa-hairoil.jpg',
              href: '/products/lovixa-hair-oil',
            },
            {
              tag: 'BEYOND ONE OPTION!',
              title: 'SHAMPOOS',
              subtitle: 'GENTLE BOTANICAL PURIFYING CLEANSERS',
              imageUrl: '/images/lovixa-shampoo.jpg',
              href: '/products/lovixa-shampoo',
            },
            {
              tag: 'BEYOND ONE OPTION!',
              title: 'COMBOS',
              subtitle: 'COMPLETE 2-STEP VALUE RITUAL KITS',
              imageUrl: '/images/lovixa-duo.jpg',
              href: '/products/lovixa-hair-care-duo',
            },
          ],
        },
        brandStory: {
          heading: 'The LOVIXA Philosophy',
          storyText:
            'At LOVIXA, we believe your hair care goes beyond what you see in the mirror — and deserves mindful self-care that goes deeper to the roots. We bring you thoughtful, time-honored Ayurvedic botanical solutions that nurture your scalp with trust, cold-pressed purity, and dermatologically tested clinical efficacy.',
          seals: [
            {
              iconType: 'leaf',
              title: '100% Ayurvedic',
              subtitle: 'Cold-Pressed Herbs',
              desc: 'Pure extracts of Bhringraj, Amla & Rosemary brewed naturally.',
            },
            {
              iconType: 'award',
              title: 'AYUSH Certified',
              subtitle: 'Lab-Tested Purity',
              desc: 'Adheres to stringent quality and botanical standardization protocols.',
            },
            {
              iconType: 'shield',
              title: 'Dermatologist Safe',
              subtitle: 'Zero Harsh Sulfates',
              desc: 'Free of SLS/SLES, parabens & synthetic silicones for sensitive scalps.',
            },
            {
              iconType: 'heart',
              title: '100% Cruelty-Free',
              subtitle: 'Vegan & Ethical',
              desc: 'Crafted with respect for nature. Never tested on animals.',
            },
          ],
        },
        faqs: {
          heading: 'Frequently Asked Questions',
          subtitle: 'Everything you need to know about our ingredients, rituals & shipping',
          items: [
            {
              question: 'Are LOVIXA formulations safe for daily use & sensitive scalp?',
              answer:
                'Yes! Both LOVIXA Shampoo and Hair Oil are formulated with 100% clean, botanical actives without harsh sulfates (SLS/SLES), parabens, mineral oils, or synthetic silicones. They are pH-balanced, dermatologically tested, and suitable for sensitive scalps and color-treated hair.',
            },
            {
              question: 'How should I use the Hair Oil and Shampoo in my weekly routine?',
              answer:
                'For best results, apply 4-6 drops of Nourishing Hair Oil directly onto the scalp and roots 20-30 minutes before washing (or overnight). Follow with LOVIXA Refreshing Botanical Shampoo to cleanse away excess oil and grime without stripping moisture. Use 2-3 times per week.',
            },
            {
              question: 'What are the shipping charges and delivery timelines across India?',
              answer:
                'We provide Free Express Shipping on all prepaid orders across India above ₹499. Orders are packed within 24 business hours from our certified Ayurvedic facility and usually reach your doorstep in 3 to 5 business days with full SMS tracking.',
            },
            {
              question: 'Are LOVIXA products 100% cruelty-free and vegan?',
              answer:
                'Absolutely. We do not conduct animal testing at any stage of product research, formulation, or manufacturing. Every product is 100% vegan, cruelty-free, and adheres to ethical Ayurvedic standards.',
            },
          ],
        },
        community: {
          heading: 'Follow @lovixa_cosmetic',
          subtitle: 'Tag us in your daily hair rituals for a chance to be featured on our official feed',
          vipBadge: 'LOVIXA VIP RITUAL CLUB',
          vipTitle: 'Get 15% Off Your First Order',
          vipSubtitle:
            'Sign up for Ayurvedic hair guides, new botanical launches, and get an instant voucher code: LOVIXA15.',
          vipCode: 'LOVIXA15',
          galleryImages: [
            { imageUrl: '/images/lovixa-insta-1.jpg', caption: '@lovixa_cosmetic ritual' },
            { imageUrl: '/images/lovixa-insta-2.jpg', caption: 'Botanical morning care' },
            { imageUrl: '/images/lovixa-insta-3.jpg', caption: 'Root strengthening drops' },
            { imageUrl: '/images/lovixa-hero-banner-products.jpg', caption: 'Clean Ayurvedic self-care' },
          ],
        },
      },
    })

    console.log('✨ LOVIXA COSMETIC store seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedEcommerce()
