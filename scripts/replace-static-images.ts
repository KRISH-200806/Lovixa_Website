import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

async function replaceStaticImages() {
  console.log('🔄 Converting and replacing all static fake AI images with 100% original Lovixa photography...')

  const duoPng = path.resolve(process.cwd(), 'public/images/lovixa-duo.png')
  const shampooPng = path.resolve(process.cwd(), 'public/images/lovixa-shampoo.png')
  const oilPng = path.resolve(process.cwd(), 'public/images/lovixa-hairoil.png')
  const howToUseOilPng = path.resolve(process.cwd(), 'public/images/real-how-to-use-oil.png')
  const oilDetailPng = path.resolve(process.cwd(), 'public/images/real-oil-detail.png')
  const howToUseShampooPng = path.resolve(process.cwd(), 'public/images/real-how-to-use-shampoo.png')
  const shampooDetailPng = path.resolve(process.cwd(), 'public/images/real-shampoo-detail.png')

  if (!fs.existsSync(duoPng) || !fs.existsSync(shampooPng) || !fs.existsSync(oilPng)) {
    throw new Error('Real PNG files not found!')
  }

  // 1. Replace lovixa-duo.jpg with real Duo image
  await sharp(duoPng)
    .jpeg({ quality: 92 })
    .toFile(path.resolve(process.cwd(), 'public/images/lovixa-duo.jpg'))
  console.log('✓ Replaced public/images/lovixa-duo.jpg')

  // 2. Replace lovixa-shampoo.jpg with real 200ml Shampoo image
  await sharp(shampooPng)
    .jpeg({ quality: 92 })
    .toFile(path.resolve(process.cwd(), 'public/images/lovixa-shampoo.jpg'))
  console.log('✓ Replaced public/images/lovixa-shampoo.jpg')

  // 3. Replace lovixa-hairoil.jpg with real 100ml Hair Oil image
  await sharp(oilPng)
    .jpeg({ quality: 92 })
    .toFile(path.resolve(process.cwd(), 'public/images/lovixa-hairoil.jpg'))
  console.log('✓ Replaced public/images/lovixa-hairoil.jpg')

  // 4. Replace lovixa-hero-banner-products.jpg and lovixa-hero.jpg (was fake AETERNA) with real Duo
  await sharp(duoPng)
    .jpeg({ quality: 92 })
    .toFile(path.resolve(process.cwd(), 'public/images/lovixa-hero-banner-products.jpg'))
  await sharp(duoPng)
    .jpeg({ quality: 92 })
    .toFile(path.resolve(process.cwd(), 'public/images/lovixa-hero.jpg'))
  console.log('✓ Replaced public/images/lovixa-hero-banner-products.jpg and lovixa-hero.jpg')

  // 5. Replace fake insta images
  if (fs.existsSync(howToUseOilPng)) {
    await sharp(howToUseOilPng)
      .jpeg({ quality: 92 })
      .toFile(path.resolve(process.cwd(), 'public/images/lovixa-insta-1.jpg'))
    console.log('✓ Replaced public/images/lovixa-insta-1.jpg with real oil how-to-use')
  }

  if (fs.existsSync(oilDetailPng)) {
    await sharp(oilDetailPng)
      .jpeg({ quality: 92 })
      .toFile(path.resolve(process.cwd(), 'public/images/lovixa-insta-3.jpg'))
    console.log('✓ Replaced public/images/lovixa-insta-3.jpg with real oil details')
  }

  if (fs.existsSync(howToUseShampooPng)) {
    await sharp(howToUseShampooPng)
      .jpeg({ quality: 92 })
      .toFile(path.resolve(process.cwd(), 'public/images/lovixa-insta-4.jpg'))
    console.log('✓ Replaced public/images/lovixa-insta-4.jpg with real shampoo how-to-use')
  }

  // 6. Replace OpenGraph images with real duo
  await sharp(duoPng)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.resolve(process.cwd(), 'public/images/lovixa-og.jpg'))
  await sharp(duoPng)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.resolve(process.cwd(), 'public/lovixa-og.jpg'))
  await sharp(duoPng)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.resolve(process.cwd(), 'public/opengraph-image.jpg'))
  await sharp(duoPng)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.resolve(process.cwd(), 'src/app/(store)/opengraph-image.jpg'))
  await sharp(duoPng)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(path.resolve(process.cwd(), 'src/app/(store)/twitter-image.jpg'))
  console.log('✓ Replaced all OG / Twitter social share images with real Duo')

  console.log('🎉 All static placeholder images successfully replaced with 100% original Lovixa photos!')
}

replaceStaticImages().catch((e) => {
  console.error(e)
  process.exit(1)
})
