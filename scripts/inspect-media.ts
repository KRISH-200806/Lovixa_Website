import { getPayload } from 'payload'
import config from '../src/payload.config'
import { config as loadDotenv } from 'dotenv'

loadDotenv()

async function inspectData() {
  const payload = await getPayload({ config })
  const hp = await payload.findGlobal({ slug: 'homepage' })
  console.log('Homepage promoBanner:', JSON.stringify(hp?.promoBanner, null, 2))

  const mediaDocs = await payload.find({
    collection: 'media',
    limit: 100,
  })
  console.log('Media count:', mediaDocs.totalDocs)
  for (const m of mediaDocs.docs) {
    console.log(`- Media: id=${m.id}, filename=${m.filename}, url=${m.url}, alt=${m.alt}`)
  }

  const prods = await payload.find({
    collection: 'products',
    limit: 20,
  })
  console.log('Products count:', prods.totalDocs)
  for (const p of prods.docs) {
    console.log(`- Product: id=${p.id}, slug=${p.slug}, title=${p.title}, size=${p.size}, images=`, p.images)
  }
  process.exit(0)
}

inspectData().catch(e => {
  console.error(e)
  process.exit(1)
})
