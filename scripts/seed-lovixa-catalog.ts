import { getPayload } from 'payload'
import config from '../src/payload.config'
import { config as loadDotenv } from 'dotenv'

loadDotenv()

async function seedLovixaCatalog() {
  console.log('🌿 [Phase 2] Seeding Authoritative LOVIXA Product Catalog to MongoDB...')

  try {
    const payload = await getPayload({ config })

    // 1. Ensure Brand: LOVIXA COSMETIC
    console.log('→ Verifying Brand: LOVIXA COSMETIC...')
    let brandDoc: any
    const existingBrands = await payload.find({
      collection: 'brands',
      where: { slug: { equals: 'lovixa-cosmetic' } },
      limit: 1,
    })

    if (existingBrands.docs.length > 0) {
      brandDoc = existingBrands.docs[0]
      console.log(`  ✓ Brand already exists: ${brandDoc.name} (${brandDoc.id})`)
    } else {
      brandDoc = await payload.create({
        collection: 'brands',
        data: {
          name: 'LOVIXA COSMETIC',
          slug: 'lovixa-cosmetic',
          website: 'https://lovixacosmetic.com',
        },
      })
      console.log(`  ✓ Created Brand: ${brandDoc.name} (${brandDoc.id})`)
    }

    // 2. Ensure Categories
    console.log('→ Verifying Categories...')
    const categoryDefs = [
      {
        name: 'Everyday Hair Care',
        slug: 'hair-care',
        description: 'Time-tested botanical formulations crafted for gentle daily hair and scalp wellness.',
        badge: 'Botanical Hair Care',
      },
      {
        name: 'Refreshing Shampoo',
        slug: 'shampoo',
        description: 'Gentle clarifying plant-derived cleanser for clean, buoyant, everyday hair vitality.',
        badge: 'Gentle Everyday Cleansing',
      },
      {
        name: 'Nourishing Hair Oil',
        slug: 'hair-oil',
        description: 'Lightweight cold-pressed botanical lipid elixir for root strengthening and frizz sealing.',
        badge: 'Self-Care Ritual Elixir',
      },
      {
        name: 'Hair Care Ritual Duo',
        slug: 'bundles',
        description: 'Complete 2-step Ayurvedic care system: Pre-wash Oil nourishment paired with clarifying Shampoo.',
        badge: 'Complete Care Pair',
      },
    ]

    const categoryMap: Record<string, string> = {}
    for (const cat of categoryDefs) {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        categoryMap[cat.slug] = existing.docs[0].id
        console.log(`  ✓ Category exists: ${cat.name} (${existing.docs[0].id})`)
      } else {
        const created = await payload.create({
          collection: 'categories',
          data: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            badge: cat.badge,
          },
        })
        categoryMap[cat.slug] = created.id
        console.log(`  ✓ Created Category: ${cat.name} (${created.id})`)
      }
    }

    // 3. Products Definition (User-Approved Pricing: Shampoo ₹299 / Hair Oil ₹299 / Duo Combo ₹549)
    console.log('→ Verifying Products and Variants...')
    const productDefs = [
      {
        slug: 'lovixa-shampoo',
        title: 'LOVIXA Shampoo',
        basePrice: 299,
        compareAtPrice: 399,
        stock: 100,
        size: '500ml e (16.9 fl. oz)',
        tags: ['featured', 'best-seller'],
        categories: [categoryMap['shampoo'], categoryMap['hair-care']].filter(Boolean),
        shortDescription:
          'A refreshing addition to your everyday hair cleansing routine. Crafted to gently wash away daily build-up while keeping hair soft, balanced, and naturally luminous.',
        actives: [
          {
            name: 'Botanical Cleansing Complex',
            desc: 'Gentle plant-derived surfactant blend that washes away daily dust and excess sebum without stripping the protective scalp moisture barrier.',
          },
          {
            name: 'Rosemary & Eucalyptus Botanical Blend',
            desc: 'Refreshes and awakens the scalp with an uplifting natural herbal profile that promotes clean hair vitality.',
          },
          {
            name: 'Provitamin B5 (Panthenol)',
            desc: 'Binds moisture to the hair shaft to improve tensile elasticity, strand softness, and effortless natural combability.',
          },
        ],
        benefits: [
          { claim: 'Gentle everyday clarifying without dryness or straw-like feel', highlight: true },
          { claim: 'Leaves hair soft, manageable, and naturally buoyant', highlight: true },
          { claim: 'Balanced scalp-friendly pH formulation', highlight: false },
          { claim: 'Free from harsh sulfates, parabens, and synthetic silicones', highlight: true },
        ],
        ritualSteps: [
          { stepNumber: 1, title: 'Wet', instruction: 'Wet hair thoroughly with lukewarm water.' },
          { stepNumber: 2, title: 'Lather', instruction: 'Dispense a coin-sized amount into palms and gently massage into scalp and lengths until a soft, refreshing lather forms.' },
          { stepNumber: 3, title: 'Rinse', instruction: 'Rinse cleanly with water. For optimal nourishment, pair with LOVIXA Hair Oil as your weekly self-care ritual.' },
        ],
        caution:
          'For external use only. Avoid contact with eyes. In case of contact, rinse immediately with clean water. Keep out of reach of children.',
        ingredients:
          'Purified Aqua, Sodium Lauroyl Methyl Isethionate, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Glycerin, Rosmarinus Officinalis (Rosemary) Leaf Extract, Eucalyptus Globulus Leaf Oil, D-Panthenol (Provitamin B5), Polyquaternium-10, Phenoxyethanol, Ethylhexylglycerin, Citric Acid, Disodium EDTA, Natural Herbal Fragrance.',
        variant: {
          sku: 'LVX-SHMP-500ML',
          title: '500ml Bottle',
          price: 299,
          compareAtPrice: 399,
          inventory: 100,
        },
        seo: {
          metaTitle: 'LOVIXA Shampoo (500ml) — Botanical Hair Cleanser | LOVIXA COSMETIC',
          metaDescription: 'Shop LOVIXA Botanical Refreshing Shampoo (500ml) online at ₹299. Gentle clarifying formula with Rosemary and Provitamin B5 for soft, healthy hair.',
          focusKeywords: 'botanical shampoo, sulfate free shampoo, rosemary shampoo, hair care, LOVIXA cosmetic',
          canonicalUrl: 'https://lovixacosmetic.com/products/lovixa-shampoo',
        },
      },
      {
        slug: 'lovixa-hair-oil',
        title: 'LOVIXA Hair Oil',
        basePrice: 299,
        compareAtPrice: 399,
        stock: 100,
        size: '50ml | 1.69 fl. oz Dropper Bottle',
        tags: ['featured', 'best-seller'],
        categories: [categoryMap['hair-oil'], categoryMap['hair-care']].filter(Boolean),
        shortDescription:
          'Make hair oiling a relaxing part of your self-care ritual. Deeply nourishes strands from root to tip with a lightweight botanical blend that leaves hair silky and manageable.',
        actives: [
          {
            name: 'Cold-Pressed Botanical Elixir',
            desc: 'Lightweight lipid blend selected to penetrate strand porosity without weighing down hair roots or leaving sticky build-up.',
          },
          {
            name: 'Strand-Sealing Botanical Lipids',
            desc: 'Smooths the hair cuticle, sealing in moisture to reduce frizz and protect ends against environmental wear.',
          },
          {
            name: 'Herbal Scalp-Soothing Extract',
            desc: 'Calms and hydrates dry scalp during gentle circular fingertip massage, turning hair oiling into a peaceful self-care moment.',
          },
        ],
        benefits: [
          { claim: 'Deep root-to-tip nourishment for silky, touchable strands', highlight: true },
          { claim: 'Non-greasy, lightweight texture that washes out cleanly with shampoo', highlight: true },
          { claim: 'Helps tame flyaways and restore natural healthy gloss', highlight: false },
          { claim: 'Ideal for relaxing evening or pre-wash scalp massage', highlight: true },
        ],
        ritualSteps: [
          { stepNumber: 1, title: 'Dispense', instruction: 'Fill the glass dropper and dispense 4–6 drops into clean palms.' },
          { stepNumber: 2, title: 'Massage', instruction: 'Gently massage into scalp using small circular fingertip motions to nourish roots and relieve tension.' },
          { stepNumber: 3, title: 'Rest & Wash', instruction: 'Work remaining oil through hair lengths. Leave on for 20–30 minutes (or overnight) before washing with LOVIXA Shampoo.' },
        ],
        caution:
          'For external use only. Perform a patch test before first use. Store in a cool, dry place away from direct sunlight.',
        ingredients:
          'Sesamum Indicum (Sesame) Seed Oil, Cocos Nucifera (Coconut) Oil, Helianthus Annuus (Sunflower) Seed Oil, Eclipta Prostrata (Bhringraj) Extract, Emblica Officinalis (Amla) Fruit Extract, Rosmarinus Officinalis (Rosemary) Leaf Oil, Tocopheryl Acetate (Vitamin E), Prunus Amygdalus Dulcis (Sweet Almond) Oil, Natural Botanical Fragrance.',
        variant: {
          sku: 'LVX-OIL-50ML',
          title: '50ml Dropper Bottle',
          price: 299,
          compareAtPrice: 399,
          inventory: 100,
        },
        seo: {
          metaTitle: 'LOVIXA Hair Oil (50ml) — Cold-Pressed Scalp Elixir | LOVIXA COSMETIC',
          metaDescription: 'Shop LOVIXA Nourishing Hair Oil (50ml) online at ₹299. Pure cold-pressed herbal oils with Bhringraj & Rosemary for root nourishment and anti-frizz shine.',
          focusKeywords: 'ayurvedic hair oil, cold pressed hair oil, bhringraj oil, rosemary hair oil, LOVIXA',
          canonicalUrl: 'https://lovixacosmetic.com/products/lovixa-hair-oil',
        },
      },
      {
        slug: 'lovixa-hair-care-duo',
        title: 'LOVIXA Hair Care Duo',
        basePrice: 549,
        compareAtPrice: 699,
        stock: 50,
        size: 'Complete Ritual Pair: 500ml Shampoo + 50ml Hair Oil',
        tags: ['featured', 'on-sale', 'best-seller'],
        categories: [categoryMap['bundles'], categoryMap['hair-care']].filter(Boolean),
        shortDescription:
          'Two Essentials. One Beautiful Ritual. Pair your LOVIXA Shampoo with our Hair Oil and make every hair care day feel special.',
        actives: [
          {
            name: 'Synergistic Care System',
            desc: 'The nourishing lipid treatment of LOVIXA Hair Oil followed by the clarifying botanical cleanse of LOVIXA Shampoo provides the ideal hair ritual.',
          },
          {
            name: 'Botanical Hair & Scalp Harmony',
            desc: 'Formulated to complement each other seamlessly for soft, buoyant, touchably healthy hair.',
          },
        ],
        benefits: [
          { claim: 'Complete two-step daily hair care regimen', highlight: true },
          { claim: 'Pre-wash nourishment paired with gentle daily cleansing', highlight: true },
          { claim: 'Special duo combination value savings (Save ₹150)', highlight: true },
        ],
        ritualSteps: [
          { stepNumber: 1, title: 'Oil', instruction: 'Apply LOVIXA Hair Oil to scalp and lengths. Leave on for 20–30 minutes to deeply nourish roots.' },
          { stepNumber: 2, title: 'Cleanse', instruction: 'Wash thoroughly with LOVIXA Shampoo to rinse away excess oils and reveal soft, clean hair.' },
          { stepNumber: 3, title: 'Enjoy', instruction: 'Enjoy light, bouncy hair with natural shine all day long.' },
        ],
        caution:
          'For external use only. Follow individual packaging instructions on both bottles.',
        ingredients:
          'LOVIXA Shampoo (500ml) and LOVIXA Hair Oil (50ml) formulation ingredients as declared on primary bottles.',
        variant: {
          sku: 'LVX-DUO-SET',
          title: 'Complete Ritual Duo Set (500ml + 50ml)',
          price: 549,
          compareAtPrice: 699,
          inventory: 50,
        },
        seo: {
          metaTitle: 'LOVIXA Hair Care Duo (Shampoo 500ml + Oil 50ml) — Value Combo | LOVIXA',
          metaDescription: 'Shop LOVIXA Complete Hair Care Duo at special combo price ₹549 (MRP ₹699). Includes 500ml Botanical Shampoo & 50ml Nourishing Hair Oil.',
          focusKeywords: 'hair care combo, shampoo and hair oil set, ayurvedic hair kit, LOVIXA duo',
          canonicalUrl: 'https://lovixacosmetic.com/products/lovixa-hair-care-duo',
        },
      },
    ]

    for (const p of productDefs) {
      let productDoc: any
      const existingProduct = await payload.find({
        collection: 'products',
        where: { slug: { equals: p.slug } },
        limit: 1,
      })

      const productData: any = {
        title: p.title,
        slug: p.slug,
        isPublished: true,
        brand: brandDoc.id,
        categories: p.categories,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        shortDescription: p.shortDescription,
        trackInventory: true,
        stock: p.stock,
        tags: p.tags,
        size: p.size,
        actives: p.actives,
        benefits: p.benefits,
        ritualSteps: p.ritualSteps,
        ingredients: p.ingredients,
        caution: p.caution,
        hasVariants: true,
        seo: p.seo,
      }

      if (existingProduct.docs.length > 0) {
        productDoc = await payload.update({
          collection: 'products',
          id: existingProduct.docs[0].id,
          data: productData,
        })
        console.log(`  ✓ Updated Product: ${p.title} (${productDoc.id}) at ₹${p.basePrice}`)
      } else {
        productDoc = await payload.create({
          collection: 'products',
          data: productData,
        })
        console.log(`  ✓ Created Product: ${p.title} (${productDoc.id}) at ₹${p.basePrice}`)
      }

      // Upsert Product Variant
      const existingVariant = await payload.find({
        collection: 'product-variants',
        where: { sku: { equals: p.variant.sku } },
        limit: 1,
      })

      let variantDoc: any
      const variantData = {
        sku: p.variant.sku,
        title: p.variant.title,
        product: productDoc.id,
        price: p.variant.price,
        compareAtPrice: p.variant.compareAtPrice,
        inventory: p.variant.inventory,
        allowBackorder: false,
      }

      if (existingVariant.docs.length > 0) {
        variantDoc = await payload.update({
          collection: 'product-variants',
          id: existingVariant.docs[0].id,
          data: variantData,
        })
        console.log(`    ✓ Updated Variant: ${p.variant.sku} at ₹${p.variant.price}`)
      } else {
        variantDoc = await payload.create({
          collection: 'product-variants',
          data: variantData,
        })
        console.log(`    ✓ Created Variant: ${p.variant.sku} at ₹${p.variant.price}`)
      }

      // Link variant back to product
      await payload.update({
        collection: 'products',
        id: productDoc.id,
        data: {
          variants: [variantDoc.id],
        },
      })
    }

    // 4. Seed Verified Coupons (LOVIXA15 & WELCOME10)
    console.log('→ Verifying Coupons...')
    const couponDefs = [
      {
        code: 'LOVIXA15',
        discountType: 'percentage' as const,
        discountValue: 15,
        minOrderAmount: 0,
        maxDiscountAmount: 300,
        isActive: true,
        usageLimit: 10000,
      },
      {
        code: 'WELCOME10',
        discountType: 'percentage' as const,
        discountValue: 10,
        minOrderAmount: 0,
        maxDiscountAmount: 200,
        isActive: true,
        usageLimit: 10000,
      },
    ]

    for (const c of couponDefs) {
      const existingCoupon = await payload.find({
        collection: 'coupons',
        where: { code: { equals: c.code } },
        limit: 1,
      })

      if (existingCoupon.docs.length > 0) {
        await payload.update({
          collection: 'coupons',
          id: existingCoupon.docs[0].id,
          data: c,
        })
        console.log(`  ✓ Updated Coupon: ${c.code} (${c.discountValue}%)`)
      } else {
        await payload.create({
          collection: 'coupons',
          data: c,
        })
        console.log(`  ✓ Created Coupon: ${c.code} (${c.discountValue}%)`)
      }
    }

    // 5. Update Store Settings Global (INR base currency & ₹999 shipping threshold)
    console.log('→ Synchronizing Store Settings Global...')
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
          enableStripe: false,
          enableRazorpay: false,
          enableCashOnDelivery: false,
        },
      },
    })
    console.log('  ✓ Store Settings synchronized with Base Currency = INR (₹) and Free Shipping = ₹999')

    // 6. Update Announcement Bar Global
    console.log('→ Synchronizing Announcement Bar Global...')
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

    console.log('✨ LOVIXA COSMETIC catalog & settings successfully seeded into MongoDB!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedLovixaCatalog()
