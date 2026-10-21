import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ARTIFACT_DIR = '/Users/fi-8/.gemini/antigravity-ide/brain/fd831a86-069c-4033-9fb4-71f6891afc8e'

// Mapping from clean image paths to actual generated files
const IMAGE_MAP: Record<string, string> = {
  'hero-luxury-serum.png': 'hero_luxury_serum_1791797737617.png',
  'promo-barrier-ritual.png': 'promo_barrier_ritual_1791797761167.png',
  'promo-dewy-lip-glaze.png': 'promo_dewy_lip_glaze_1791797788146.png',
  'cat-hydrating-serums.png': 'cat_hydrating_serums_1791797810695.png',
  'cat-lip-care.png': 'cat_lip_care_1791797836931.png',
  'cat-botanical-oils.png': 'cat_botanical_oils_1791797857456.png',
  'cat-barrier-creams.png': 'cat_barrier_creams_1791797884079.png',
  'cat-ritual-combos.png': 'cat_ritual_combos_1791797911921.png',
  'banner-seasonal-glow-offer.png': 'banner_seasonal_glow_offer_1791797935524.png',
  'prod-silk-powder.png': 'prod_silk_powder_1791797974966.png',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const publicPath = path.join(process.cwd(), 'public', 'images', filename)
  if (fs.existsSync(publicPath)) {
    try {
      const fileBuffer = fs.readFileSync(publicPath)
      const ext = path.extname(filename).toLowerCase()
      const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png'
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch (e) {
      console.error(e)
    }
  }

  const targetFile = IMAGE_MAP[filename] || filename
  const filePath = path.join(ARTIFACT_DIR, targetFile)

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Image not found', { status: 404 })
  }

  try {
    const fileBuffer = fs.readFileSync(filePath)
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
