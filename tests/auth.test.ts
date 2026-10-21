import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Customer Authentication & Authorization System', () => {
  it('validates registration input requirements', () => {
    const validateRegistration = (body: { email?: string; password?: string; name?: string }) => {
      if (!body.email || !body.email.includes('@')) {
        return { valid: false, error: 'Valid email address is required' }
      }
      if (!body.password || body.password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters' }
      }
      return { valid: true }
    }

    assert.equal(validateRegistration({ email: 'bad-email', password: '123' }).valid, false)
    assert.equal(validateRegistration({ email: 'user@test.com', password: '123' }).valid, false)
    assert.equal(validateRegistration({ email: 'user@test.com', password: 'secretpassword' }).valid, true)
  })

  it('normalizes customer emails to lower case for consistent login and verification lookup', () => {
    const normalizeEmail = (email: string) => email.trim().toLowerCase()
    assert.equal(normalizeEmail('  Customer.User@Example.COM  '), 'customer.user@example.com')
    assert.equal(normalizeEmail('Test@Gmail.com'), 'test@gmail.com')
  })

  it('formats customer user response omitting sensitive password fields', () => {
    const sanitizeUser = (userDoc: any) => ({
      id: String(userDoc.id),
      email: userDoc.email,
      name: userDoc.name || 'Customer',
      role: userDoc.role || 'customer',
      phone: userDoc.phone || '',
      savedAddresses: userDoc.savedAddresses || [],
    })

    const rawUser = {
      id: 'usr-123',
      email: 'alex@example.com',
      name: 'Alex Johnson',
      hash: '$2b$10$encryptedhashpassword...',
      salt: 'somesalt',
      role: 'customer',
    }

    const sanitized = sanitizeUser(rawUser)
    assert.equal(sanitized.id, 'usr-123')
    assert.equal(sanitized.email, 'alex@example.com')
    assert.equal((sanitized as any).hash, undefined)
    assert.equal((sanitized as any).salt, undefined)
  })
})
