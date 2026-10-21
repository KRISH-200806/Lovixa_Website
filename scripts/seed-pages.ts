import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const SEED_PAGES = [
  {
    title: 'Our Story & Philosophy',
    slug: 'about',
    isPublished: true,
    badge: 'OUR PHILOSOPHY',
    highlightTitle: 'Thoughtfully Yours.',
    subtitle: 'At LOVIXA COSMETIC, we believe daily care should be simple, honest, and grounded in pure botanical nourishment.',
    headerImageUrl: '/images/lovixa-story.jpg',
    aboutStory: {
      editorialPurposeBadge: 'OUR PURPOSE',
      editorialHeading: 'Care that feels thoughtful, gentle, and authentically personal.',
      editorialText: 'LOVIXA COSMETIC was created to offer an unhurried, gentle approach to modern personal care. We bring together natural plant extracts and proven cosmetic ingredients to create products that enhance your everyday routine without empty promises or overwhelming complexity.',
      storyBadge: 'THE LOVIXA DIFFERENCE',
      storyHeading: 'Formulated for real hair and skin, designed for everyday confidence.',
      storyParagraph1: "We believe your beauty routine shouldn't feel complicated. Whether it is our rosemary-infused botanical shampoo, cold-pressed hair oil, or gentle daily skin essentials, each LOVIXA formula is created to wash cleanly, moisturize deeply, and feel wonderful on your body.",
      storyParagraph2: 'We focus on what matters most: gentle cleansing agents, nourishing plant oils, balanced pH levels, and clear usage guidance so you can care for yourself with complete peace of mind.',
      storyImageUrl: '/images/about-follower.webp',
      brandPillars: [
        {
          iconType: 'leaf',
          title: 'Botanical Simplicity',
          desc: 'Selected plant extracts, nourishing oils, and gentle surfactants designed to care for hair and skin naturally.',
        },
        {
          iconType: 'shield',
          title: 'Formulation Transparency',
          desc: 'Clear ingredient profiles, pH-conscious balances, and formulas free from harsh sulfates and parabens.',
        },
        {
          iconType: 'sparkles',
          title: 'Mindful Daily Rituals',
          desc: 'Beauty care that transforms everyday washing and moisturizing into peaceful, restoring self-care moments.',
        },
        {
          iconType: 'heart',
          title: 'Dedicated Customer Care',
          desc: 'Authentic support, transparent shipping policies, and a commitment to your genuine satisfaction.',
        },
      ],
      commitments: [
        {
          title: 'Hand-Inspected Batch Quality',
          desc: 'Every batch is produced under strict quality control, dermatologically evaluated, and inspected before leaving our facility.',
        },
        {
          title: 'Cold-Pressed Potency',
          desc: 'We preserve the natural vitamins and fatty acids of rosemary, onion seed, and argan through low-heat processing.',
        },
        {
          title: 'Direct-to-Consumer Honesty',
          desc: 'No distributor markups, no exaggerated marketing claims — just pure, effective formulations priced accessibly.',
        },
      ],
    },
    seo: {
      metaTitle: 'Our Story & Philosophy — LOVIXA COSMETIC',
      metaDescription: 'Discover LOVIXA COSMETIC — thoughtful, nature-inspired formulations crafted for gentle hair and skin care.',
      canonicalUrl: 'https://www.lovixacosmetic.com/about',
    },
  },
  {
    title: 'Contact Us & Concierge',
    slug: 'contact',
    isPublished: true,
    badge: 'GET IN TOUCH',
    highlightTitle: 'Let’s Begin A Conversation',
    subtitle: 'Have a question about our botanical formulas, order dispatch, or corporate gifting? Our dedicated concierge team in Surat is here to assist you.',
    headerImageUrl: '/images/lovixa-panoramic-hero.jpg',
    contactInfo: {
      phone: '+91 97124 60509',
      supportHours: 'Mon - Sat: 10:00 AM – 6:00 PM',
      email: 'lovixacosmetic@gmail.com',
      emailNote: 'Dedicated support within 24 business hours',
      address: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha, Surat, Gujarat 395011',
      whatsappNumber: '919712460509',
      introSubtitle: 'Fill the form below and one of our concierge team members will respond within 24 business hours to assist you with your routine or order inquiries.',
      socialLinks: [
        {
          platform: 'facebook',
          url: 'https://www.facebook.com/p/Lovixa-Harbel-Care-61574511437687/',
        },
        {
          platform: 'instagram',
          url: 'https://www.instagram.com/lovixa_cosmetic',
        },
      ],
    },
    seo: {
      metaTitle: 'Contact Us — LOVIXA COSMETIC Concierge & Customer Care',
      metaDescription: 'Connect with LOVIXA COSMETIC. Speak to our hair care specialists, track orders, or request personalized routine assistance.',
      canonicalUrl: 'https://www.lovixacosmetic.com/contact',
    },
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms-conditions',
    isPublished: true,
    badge: 'TERMS OF SERVICE',
    highlightTitle: 'Terms of Service & Usage',
    subtitle: 'Clear conditions and guidelines for shopping, browsing, and ordering at LOVIXA COSMETIC.',
    headerImageUrl: '/images/lovixa-panoramic-hero.jpg',
    lastUpdated: 'October 2026 • LOVIXA COSMETIC',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content: 'By accessing, browsing, or placing an order on www.lovixacosmetic.com, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions, along with our Privacy Policy and Shipping Policy. If you do not agree with any portion of these terms, please refrain from using our online store.',
      },
      {
        heading: '2. Products, Pricing & Catalog Accuracy',
        content: 'All product descriptions, imagery, specifications, and retail prices displayed on this website are presented with the utmost care. However, minor variations in packaging color or labeling may occur due to screen resolutions and ongoing batch packaging updates.\n\nPrices are quoted in Indian Rupees (INR) and are inclusive of applicable GST taxes. We reserve the right to revise prices, discontinue items, or adjust discount promotional codes without prior notice.',
      },
      {
        heading: '3. Order Confirmation & WhatsApp Verification',
        content: 'Orders placed via our website or assisted WhatsApp checkout are subject to product availability and stock verification. Once your order is received, our system issues an electronic order confirmation.\n\nFor assisted WhatsApp or manual UPI payments, our concierge representative confirms the payment screenshot and shipping address before dispatching the consignment.',
      },
      {
        heading: '4. Payments & Invoicing',
        content: 'We accept pre-payment via secure UPI gateways (PhonePe, Google Pay, Paytm, BHIM), Net Banking, Credit/Debit cards, and Direct Bank Wire Transfer. A tax invoice is digitally emailed and enclosed physically with every dispatched parcel.',
      },
      {
        heading: '5. Intellectual Property',
        content: 'All content featured on LOVIXA COSMETIC — including text, brand graphics, product names, bottle designs, photographs, and digital assets — is the exclusive intellectual property of LOVIXA COSMETIC. Unauthorized reproduction, modification, or distribution for commercial purposes is strictly prohibited.',
      },
      {
        heading: '6. Limitation of Liability & Cosmetic Patch Test Notice',
        content: 'LOVIXA formulations are crafted with natural botanical extracts, cold-pressed carrier oils, and gentle surfactants. However, individual skin and scalp types may react differently to specific plant ingredients.\n\nWe strongly recommend performing a 24-hour patch test behind the ear or inside the elbow before full application. LOVIXA COSMETIC shall not be held liable for allergic reactions resulting from individual sensitivities to disclosed ingredients.',
      },
      {
        heading: '7. Governing Law & Jurisdiction',
        content: 'These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to your use of this site or purchases made shall be subject to the exclusive jurisdiction of the competent courts in Surat, Gujarat, India.',
      },
    ],
    seo: {
      metaTitle: 'Terms & Conditions — LOVIXA COSMETIC',
      metaDescription: 'Terms of service and purchasing conditions for LOVIXA COSMETIC website visitors and customers.',
      canonicalUrl: 'https://www.lovixacosmetic.com/terms-conditions',
    },
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    isPublished: true,
    badge: 'DATA INTEGRITY & TRUST',
    highlightTitle: 'Your Privacy is Sacred to Us',
    subtitle: 'Understand how LOVIXA COSMETIC handles, protects, and respects your personal customer data.',
    headerImageUrl: '/images/lovixa-panoramic-hero.jpg',
    lastUpdated: 'October 2026 • LOVIXA COSMETIC',
    sections: [
      {
        heading: '1. Our Privacy Commitment',
        content: 'At LOVIXA COSMETIC, your privacy and trust are sacred. We collect only information that is strictly required to process your orders, ship your packages, and provide personalized customer assistance. We never sell, rent, or trade your personal data to third-party marketing companies.',
      },
      {
        heading: '2. Information We Collect',
        content: 'When you browse or purchase from LOVIXA COSMETIC, we collect:\n\n• Contact & Shipping Details: Your name, delivery address, email address, and phone number to fulfill deliveries.\n• Order History: Information regarding purchased products and order status to assist with support and accounts.\n• Technical Logs: Browser session data, device type, and cookies essential for shopping cart functionality.',
      },
      {
        heading: '3. How We Use Your Information',
        content: 'Your information is utilized solely to:\n\n• Confirm, prepare, and deliver your cosmetic parcels across India.\n• Send automated dispatch tracking SMS, WhatsApp updates, and tax invoices.\n• Provide attentive concierge customer care when you contact our helpline.\n• Maintain store security and prevent fraudulent checkout attempts.',
      },
      {
        heading: '4. Payment Data & Financial Security',
        content: 'All online payments (UPI, Cards, Net Banking) are processed via RBI-compliant, 256-bit SSL encrypted payment gateways. LOVIXA COSMETIC never captures, processes, or stores your debit/credit card CVV or net-banking passwords on our servers.',
      },
      {
        heading: '5. Cookies & Analytics',
        content: 'We use minimal, privacy-conscious session cookies to remember your shopping cart items, selected currency, and authentication state. You may disable cookies in your browser settings, though doing so may limit your cart checkout experience.',
      },
      {
        heading: '6. Data Retention & Your Rights',
        content: 'You retain the right to request a copy of your personal data stored on our servers, or request complete deletion of your account and order history by writing to lovixacosmetic@gmail.com.',
      },
      {
        heading: '7. Policy Updates & Inquiries',
        content: 'We may occasionally update this Privacy Policy to reflect operational or regulatory changes. Updated versions will be published on this page with the revised date.\n\nFor any questions regarding our data practices, reach us at lovixacosmetic@gmail.com or call +91 97124 60509.',
      },
    ],
    seo: {
      metaTitle: 'Privacy Policy — LOVIXA COSMETIC',
      metaDescription: 'Understand how LOVIXA COSMETIC handles, protects, and respects your personal customer data.',
      canonicalUrl: 'https://www.lovixacosmetic.com/privacy-policy',
    },
  },
  {
    title: 'Shipping Policy',
    slug: 'shipping-policy',
    isPublished: true,
    badge: 'DELIVERY & DISPATCH',
    highlightTitle: 'Dispatched Fast With Care',
    subtitle: 'Explore dispatch schedules, delivery timelines across India, tracking, and trusted courier partners.',
    headerImageUrl: '/images/lovixa-hero-banner-products.jpg',
    lastUpdated: 'October 2026 • LOVIXA COSMETIC',
    sections: [
      {
        heading: '1. Processing & Dispatch Timeframe',
        content: 'Every LOVIXA order is inspected and hand-packed with protective cushioning to ensure your amber bottles arrive in pristine condition.\n\n• Orders placed Monday through Saturday before 2:00 PM IST are processed within 24 to 48 hours.\n• Orders placed on Sundays or gazetted public holidays are processed on the subsequent working day.',
      },
      {
        heading: '2. Pan-India Delivery Timelines',
        content: 'We partner with trusted tier-1 logistics couriers across India:\n\n• Metro Cities (Mumbai, Delhi-NCR, Bengaluru, Ahmedabad, Pune, Hyderabad, Chennai, Kolkata): Typically delivered in 2 to 4 business days.\n• Rest of India (Tier 2/3 Cities, Regional Towns): Typically delivered in 4 to 6 business days.',
      },
      {
        heading: '3. Shipping Charges & Free Delivery Threshold',
        content: '• Free Shipping: Complimentary express Pan-India shipping applies on all orders above ₹999.\n• Standard Shipping: A nominal flat fee of ₹99 applies to orders under ₹999 to cover protective handling and courier carriage.',
      },
      {
        heading: '4. Order Tracking & SMS/WhatsApp Alerts',
        content: 'The moment your consignment is handed over to our logistics partner, an automated dispatch notification is sent containing your AWB tracking number and live carrier tracking link. You can also view live delivery progress in your LOVIXA Account Dashboard.',
      },
      {
        heading: '5. Tampered Packages & Delivery Precautions',
        content: 'If you receive an outer shipment box that appears noticeably torn, unsealed, or heavily crushed, please do NOT accept the parcel. Refuse delivery and contact LOVIXA Concierge immediately with photos so we can dispatch a fresh replacement without delay.',
      },
    ],
    seo: {
      metaTitle: 'Shipping Policy — LOVIXA COSMETIC',
      metaDescription: 'Detailed shipping guidelines, dispatch timeframes, and pan-India delivery details for LOVIXA orders.',
      canonicalUrl: 'https://www.lovixacosmetic.com/shipping-policy',
    },
  },
  {
    title: 'Return & Replacement Policy',
    slug: 'return-refund-policy',
    isPublished: true,
    badge: 'PEACE OF MIND COMMITMENT',
    highlightTitle: 'Return & Transit Replacement Policy',
    subtitle: 'Understand our hygiene standards, transit damage replacement guarantee, and replacement procedure.',
    headerImageUrl: '/images/lovixa-hero-banner-products.jpg',
    lastUpdated: 'October 2026 • LOVIXA COSMETIC',
    sections: [
      {
        heading: '1. Hygiene & Cosmetic Safety Guidelines',
        content: 'Due to strict hygiene, cosmetic sanitation, and purity regulations, opened or used hair care and skin care products cannot be returned or restocked once delivered.\n\nWe prioritize customer safety and guarantee that every bottle dispatched from our facility is factory-fresh, sealed, and untouched.',
      },
      {
        heading: '2. Free Replacement for Transit Damage / Leakage',
        content: 'We stand 100% behind the condition of our shipments. If your bottle arrives damaged, leaking, cracked, or with a broken seal during courier transit, we will replace it FREE of charge with expedited delivery.',
      },
      {
        heading: '3. Non-Returnable / Non-Refundable Scenarios',
        content: 'Replacements or refunds cannot be issued for:\n\n• Products opened, used, or partially consumed after delivery.\n• Claims submitted after the 48-hour post-delivery window.\n• Minor personal scent or texture preferences that do not represent a manufacturing defect.\n• Incorrect delivery address entered during checkout leading to non-delivery.',
      },
      {
        heading: '4. Replacement Initiation Process',
        content: 'To request a transit damage replacement:\n\n1. Take 2–3 clear photos or a short video showing the outer delivery box, shipping label, and the damaged product.\n2. Email lovixacosmetic@gmail.com or WhatsApp our concierge at +91 97124 60509 within 48 hours of delivery.\n3. Mention your Order Number (e.g., #LOV-1024) and brief description.\n4. Once verified (within 24 hours), our team dispatches a brand-new replacement bottle at zero additional cost.',
      },
      {
        heading: '5. Cancellations Prior to Dispatch',
        content: 'You may cancel an order free of penalty anytime before it leaves our fulfillment facility. Once a dispatch tracking number (AWB) has been generated and handed to the courier, the package is in transit and cannot be recalled.',
      },
    ],
    seo: {
      metaTitle: 'Return & Replacement Policy — LOVIXA COSMETIC',
      metaDescription: 'Understand the free transit damage replacement guidelines for LOVIXA products.',
      canonicalUrl: 'https://www.lovixacosmetic.com/return-refund-policy',
    },
  },
]

async function seedPages() {
  console.log('🚀 Seeding Pages collection into Payload CMS...')
  const payload = await getPayload({ config })

  for (const pageData of SEED_PAGES) {
    try {
      const existing = await payload.find({
        collection: 'pages',
        where: {
          slug: { equals: pageData.slug },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        const id = existing.docs[0].id
        console.log(`Updating existing page: "${pageData.title}" (${pageData.slug})...`)
        await payload.update({
          collection: 'pages',
          id,
          data: pageData as any,
        })
        console.log(`  ✓ Updated page: ${pageData.slug}`)
      } else {
        console.log(`Creating new page: "${pageData.title}" (${pageData.slug})...`)
        await payload.create({
          collection: 'pages',
          data: pageData as any,
        })
        console.log(`  ✓ Created page: ${pageData.slug}`)
      }
    } catch (err: any) {
      console.error(`  ❌ Failed to seed page "${pageData.slug}":`, err.message || err)
    }
  }

  // Also sync StoreSettings contact info
  try {
    console.log('Syncing StoreSettings contact information...')
    await payload.updateGlobal({
      slug: 'store-settings',
      data: {
        contact: {
          phone: '+91 97124 60509',
          supportHours: 'Mon - Sat: 10:00 AM – 6:00 PM',
          email: 'lovixacosmetic@gmail.com',
          address: 'Yogi Chowk Rd, Jai Bhawani Society, Punagam, Varachha, Surat, Gujarat 395011',
        },
      } as any,
    })
    console.log('  ✓ Updated StoreSettings contact info')
  } catch (err: any) {
    console.warn('  Note on StoreSettings contact sync:', err.message)
  }

  console.log('🎉 All 6 Pages successfully seeded in Payload CMS!')
  process.exit(0)
}

seedPages().catch((err) => {
  console.error('Fatal seeding error:', err)
  process.exit(1)
})
