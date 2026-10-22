import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { checkRateLimit } from '../src/lib/rateLimit'

describe('Security & Abuse Protection: Login Rate Limiting (AUTH-012, SEC-008)', () => {
  it('allows normal login attempts within the configured window', () => {
    const testIp = '198.51.100.10'
    const limit = 5
    const windowMs = 60 * 1000

    for (let i = 0; i < limit; i++) {
      const allowed = checkRateLimit(`login_${testIp}`, { limit, windowMs })
      assert.equal(allowed, true, `Attempt ${i + 1} should be permitted`)
    }
  })

  it('rejects rapid repeated login attempts beyond the rate limit', () => {
    const testIp = '198.51.100.20'
    const limit = 5
    const windowMs = 60 * 1000

    // Exhaust the 5 allowed attempts
    for (let i = 0; i < limit; i++) {
      checkRateLimit(`login_${testIp}`, { limit, windowMs })
    }

    // 6th attempt must be rejected (429 condition)
    const extraAttempt = checkRateLimit(`login_${testIp}`, { limit, windowMs })
    assert.equal(extraAttempt, false, '6th attempt must be blocked by rate limiter')
  })

  it('isolates rate limits between distinct client IPs', () => {
    const ipA = '198.51.100.30'
    const ipB = '198.51.100.31'
    const limit = 3
    const windowMs = 60 * 1000

    // Exhaust IP A
    for (let i = 0; i < limit; i++) {
      checkRateLimit(`login_${ipA}`, { limit, windowMs })
    }
    assert.equal(checkRateLimit(`login_${ipA}`, { limit, windowMs }), false)

    // IP B must still be permitted
    assert.equal(checkRateLimit(`login_${ipB}`, { limit, windowMs }), true)
  })
})
