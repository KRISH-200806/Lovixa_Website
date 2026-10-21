import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const SOURCE_IMAGE = 'C:/Users/bhuva/.gemini/antigravity-ide/brain/497fdbf2-7e22-47fe-9846-5c3495b5f6f1/.user_uploaded/media_1792391605982.png'
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const IMAGES_DIR = path.resolve(PUBLIC_DIR, 'images')

async function generateAssets() {
  console.log('✨ Generating LOVIXA Logo and Icon Assets...')

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }

  // 1. Load source image and trim outer transparent margins
  const source = sharp(SOURCE_IMAGE)
  const trimmedBuffer = await source
    .trim() // removes empty transparent borders
    .toBuffer()

  const trimmedMeta = await sharp(trimmedBuffer).metadata()
  console.log(`Trimmed logo bounds: ${trimmedMeta.width}x${trimmedMeta.height}`)

  // Add 16px padding around trimmed logo for balanced rendering
  const paddedBuffer = await sharp(trimmedBuffer)
    .extend({
      top: 16,
      bottom: 16,
      left: 24,
      right: 24,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer()

  // 2. High-Res Black Logo (Original for Light Backgrounds)
  // Target width 600px for crisp retina display
  const logoBlackPng = await sharp(paddedBuffer)
    .resize({ width: 600, fit: 'inside' })
    .png({ quality: 100 })
    .toFile(path.join(IMAGES_DIR, 'lovixa-logo.png'))
  console.log('✓ Created public/images/lovixa-logo.png')

  await sharp(paddedBuffer)
    .resize({ width: 600, fit: 'inside' })
    .webp({ quality: 95 })
    .toFile(path.join(IMAGES_DIR, 'lovixa-logo.webp'))
  console.log('✓ Created public/images/lovixa-logo.webp')

  // 3. High-Res White/Ivory Logo (for Dark Backgrounds like Footer)
  // To make white: extract alpha channel, create a solid white/cream image, and use alpha as mask
  const { data, info } = await sharp(paddedBuffer)
    .resize({ width: 600, fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true })

  // Recolor all non-transparent pixels to ivory #FBF6F8 (251, 246, 248)
  const whiteData = Buffer.from(data)
  for (let i = 0; i < whiteData.length; i += 4) {
    const alpha = whiteData[i + 3]
    if (alpha > 0) {
      whiteData[i] = 251     // R
      whiteData[i + 1] = 246 // G
      whiteData[i + 2] = 248 // B
      // keep alpha as is
    }
  }

  await sharp(whiteData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png({ quality: 100 })
    .toFile(path.join(IMAGES_DIR, 'lovixa-logo-white.png'))
  console.log('✓ Created public/images/lovixa-logo-white.png')

  await sharp(whiteData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .webp({ quality: 95 })
    .toFile(path.join(IMAGES_DIR, 'lovixa-logo-white.webp'))
  console.log('✓ Created public/images/lovixa-logo-white.webp')

  // 4. Rose Gold Logo (#E8C4D4: 232, 196, 212)
  const goldData = Buffer.from(data)
  for (let i = 0; i < goldData.length; i += 4) {
    const alpha = goldData[i + 3]
    if (alpha > 0) {
      goldData[i] = 232     // R
      goldData[i + 1] = 196 // G
      goldData[i + 2] = 212 // B
    }
  }

  await sharp(goldData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png({ quality: 100 })
    .toFile(path.join(IMAGES_DIR, 'lovixa-logo-gold.png'))
  console.log('✓ Created public/images/lovixa-logo-gold.png')

  // 5. Square App Icon / Favicon / Apple Touch Icon (512x512)
  // Luxury badge with deep burgundy background (#2B1822) or cream background
  // Let's create both:
  // a) Icon on circular/rounded burgundy badge with white logo
  // b) Clean transparent favicon
  const squareIconBuffer = await sharp(whiteData, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .resize(400, null, { fit: 'inside' })
    .png()
    .toBuffer()

  // 512x512 luxury app icon
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 43, g: 24, b: 34, alpha: 1 }, // #2B1822
    },
  })
    .composite([
      {
        input: squareIconBuffer,
        gravity: 'center',
      },
    ])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon.png'))
  console.log('✓ Created public/icon.png (512x512)')

  // Apple touch icon (180x180)
  await sharp(path.join(PUBLIC_DIR, 'icon.png'))
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'))
  console.log('✓ Created public/apple-touch-icon.png (180x180)')

  // Copy icon to public/images/lovixa-icon.png
  await sharp(path.join(PUBLIC_DIR, 'icon.png'))
    .png()
    .toFile(path.join(IMAGES_DIR, 'lovixa-icon.png'))
  console.log('✓ Created public/images/lovixa-icon.png')

  // Generate 32x32 PNG for favicon
  const png32 = await sharp(path.join(PUBLIC_DIR, 'icon.png'))
    .resize(32, 32)
    .png()
    .toBuffer()

  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.png'), png32)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), png32)

  // Construct valid ICO file containing the 32x32 PNG
  const icoHeader = Buffer.alloc(22)
  icoHeader.writeUInt16LE(0, 0) // Reserved
  icoHeader.writeUInt16LE(1, 2) // Type: 1 = ICO
  icoHeader.writeUInt16LE(1, 4) // 1 image
  icoHeader.writeUInt8(32, 6)   // Width: 32
  icoHeader.writeUInt8(32, 7)   // Height: 32
  icoHeader.writeUInt8(0, 8)    // Color count (0 = no palette)
  icoHeader.writeUInt8(0, 9)    // Reserved
  icoHeader.writeUInt16LE(1, 10)  // Color planes
  icoHeader.writeUInt16LE(32, 12) // Bits per pixel
  icoHeader.writeUInt32LE(png32.length, 14) // Image data size
  icoHeader.writeUInt32LE(22, 18)           // Image data offset (6 header + 16 entry = 22)

  const icoBuffer = Buffer.concat([icoHeader, png32])
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer)
  console.log('✓ Created public/favicon.ico')

  // Next.js App Router icons in src/app/(store)
  const appDir = path.resolve(process.cwd(), 'src/app')
  fs.copyFileSync(path.join(PUBLIC_DIR, 'icon.png'), path.join(appDir, 'icon.png'))
  fs.copyFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), path.join(appDir, 'apple-icon.png'))
  fs.copyFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), path.join(appDir, 'favicon.ico'))
  console.log('✓ Created src/app/icon.png, apple-icon.png, favicon.ico')

  console.log('🎉 All LOVIXA logo & icon assets generated successfully!')

  console.log('🎉 All LOVIXA logo & icon assets generated successfully!')
}

generateAssets().catch((err) => {
  console.error('Error generating assets:', err)
  process.exit(1)
})
