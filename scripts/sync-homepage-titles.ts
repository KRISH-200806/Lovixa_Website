import { getPayload } from 'payload'
import config from '../src/payload.config'
import { config as loadDotenv } from 'dotenv'

loadDotenv()

async function syncHomepageTitles() {
  console.log('🔄 Checking and updating MongoDB homepage global with elevated brand titles...')

  try {
    const payload = await getPayload({ config })
    const current = await payload.findGlobal({ slug: 'homepage' })

    console.log('Current Homepage Global found:', Boolean(current))

    const updated = await payload.updateGlobal({
      slug: 'homepage',
      data: {
        whyChooseUs: {
          heading: 'The LOVIXA Purity Standard',
          subtitle: 'Time-honored Ayurvedic wisdom married with modern clean cosmetic science — uncompromised botanical integrity',
          pillars: current?.whyChooseUs?.pillars || undefined,
        },
        concernsSection: {
          ...current?.concernsSection,
          eyebrow: 'TARGETED BOTANICAL CARE',
          heading: 'Targeted Rituals for Every Hair Need',
          subtitle: 'Select your primary hair goal to explore the dedicated two-step restorative Ayurvedic regimen',
        },
        promoBanner: {
          ...current?.promoBanner,
          sectionTitle: 'The Essential Scalp & Strand Ritual Duo',
          sectionSubtitle: 'Combine our Botanical Cleanser and Cold-Pressed Scalp Elixir for lasting flake defense, root strength, and mirror gloss',
          badge: 'SIGNATURE CEREMONY SET',
          ritualTitle: 'TWO-STEP RESTORATIVE CEREMONY',
        },
        realExperience: {
          ...current?.realExperience,
          heading: 'Real Rituals, Visible Transformations',
          subtitle: 'Authentic hair journeys, daily rituals, and unfiltered results shared by our loyal community',
        },
        categoryPedestals: {
          ...current?.categoryPedestals,
          heading: 'Thoughtfully Formulated For Every Strand',
          subtitle: 'From clarifying washes to cold-pressed scalp oils, discover the purposeful rituals crafted for your hair',
        },
        brandStory: {
          ...current?.brandStory,
          heading: 'The LOVIXA Botanical Heritage',
        },
        faqs: {
          ...current?.faqs,
          heading: 'Hair Ritual & Care Guidance',
          subtitle: 'Everything you need to know about our botanical sourcing, usage rituals, and mindful delivery',
        },
        community: {
          ...current?.community,
          heading: 'Moments of Botanical Self-Care',
          subtitle: 'Share your daily hair ceremonies and tag @lovixa_cosmetic to be featured in our botanical gallery',
          vipBadge: 'THE LOVIXA PRIVILEGE CIRCLE',
          vipTitle: 'Enjoy 15% Off Your First Botanical Ritual',
        },
      },
    })

    console.log('✅ Successfully updated Homepage Global in MongoDB!')
    console.log('Updated sections:', {
      whyChooseUs: updated?.whyChooseUs?.heading,
      concerns: updated?.concernsSection?.heading,
      promoBanner: updated?.promoBanner?.sectionTitle,
      realExperience: updated?.realExperience?.heading,
      categoryPedestals: updated?.categoryPedestals?.heading,
      brandStory: updated?.brandStory?.heading,
      faqs: updated?.faqs?.heading,
      community: updated?.community?.heading,
    })
    process.exit(0)
  } catch (error) {
    console.error('❌ Error syncing homepage titles in MongoDB:', error)
    process.exit(1)
  }
}

syncHomepageTitles()
