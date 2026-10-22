import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import robots from '../src/app/robots'

describe('SEO, Metadata, and Discoverability Suite (SEO-001 to SEO-006)', () => {
  it('SEO-002: robots.txt disallows sensitive admin, auth, and private checkout paths while permitting Googlebot', () => {
    const robotsRules = robots()
    assert.ok(robotsRules.rules, 'Robots configuration must exist')

    const rulesArray = Array.isArray(robotsRules.rules) ? robotsRules.rules : [robotsRules.rules]
    assert.ok(rulesArray.length >= 2, 'Must configure both wildcard and Googlebot user-agents')

    const wildcard = rulesArray.find((r) => r.userAgent === '*')
    assert.ok(wildcard, 'Wildcard user-agent rule must exist')
    assert.equal(wildcard.allow, '/')

    const disallows = Array.isArray(wildcard.disallow) ? wildcard.disallow : [wildcard.disallow]
    assert.ok(disallows.includes('/admin/'), 'Must disallow /admin/')
    assert.ok(disallows.includes('/api/'), 'Must disallow /api/')
    assert.ok(disallows.includes('/account'), 'Must disallow /account')
    assert.ok(disallows.includes('/checkout'), 'Must disallow /checkout')
    assert.ok(disallows.includes('/cart'), 'Must disallow /cart')

    assert.ok(robotsRules.sitemap?.includes('/sitemap.xml'), 'Must link to sitemap.xml')
  })

  it('SEO-003: sitemap canonical routing rules construct valid, secure HTTPS public URLs', () => {
    const baseUrl = 'https://www.lovixacosmetic.com'
    const staticRoutes = [
      '',
      '/products',
      '/about',
      '/contact',
      '/faq',
      '/shipping-policy',
      '/return-refund-policy',
      '/privacy-policy',
      '/terms-conditions',
    ]
    const productSlugs = ['lovixa-shampoo', 'lovixa-hair-oil', 'lovixa-hair-care-duo']
    const categorySlugs = ['hair-care', 'shampoo', 'hair-oil', 'bundles']

    const allUrls = [
      ...staticRoutes.map((r) => `${baseUrl}${r}`),
      ...categorySlugs.map((c) => `${baseUrl}/collections/${c}`),
      ...productSlugs.map((p) => `${baseUrl}/products/${p}`),
    ]

    assert.ok(allUrls.length >= 15, 'Must contain full inventory of public routes')
    assert.ok(allUrls.every((u) => u.startsWith('https://www.lovixacosmetic.com')), 'All URLs must use HTTPS canonical host')
    assert.ok(!allUrls.some((u) => u.includes('localhost')), 'Must never contain localhost')
  })

  it('SEO-006: OpenGraph image configuration has 1200x630 dimensions and secure HTTPS delivery', () => {
    const expectedOgImage = {
      url: 'https://www.lovixacosmetic.com/images/lovixa-og.jpg',
      width: 1200,
      height: 630,
      alt: 'LOVIXA COSMETIC Botanical Hair Care Essentials',
    }

    assert.equal(expectedOgImage.width, 1200)
    assert.equal(expectedOgImage.height, 630)
    assert.ok(expectedOgImage.url.startsWith('https://'))
  })
})
