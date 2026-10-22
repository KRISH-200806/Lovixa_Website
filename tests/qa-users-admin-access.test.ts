import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Users } from '../src/collections/Users'

describe('Security Regression Test: Payload Admin Access Control (AUTH-017, ADMIN-009, SEC-002, SEC-015)', () => {
  it('Users collection must define access.admin rule to restrict /admin access', () => {
    assert.ok(
      Users.access,
      'Users collection must have an access object configured'
    )
    assert.equal(
      typeof Users.access?.admin,
      'function',
      'Users.access.admin MUST be a function to block unauthorized customer logins to /admin'
    )
  })

  it('rejects unauthenticated requests from accessing admin panel', () => {
    const adminAccess = Users.access?.admin
    if (typeof adminAccess !== 'function') {
      assert.fail('Users.access.admin is not defined!')
    }

    const unauthReq = { req: { user: null } } as any
    const isAllowed = adminAccess(unauthReq)
    assert.equal(Boolean(isAllowed), false, 'Unauthenticated user MUST NOT access admin panel')
  })

  it('strictly blocks customer role from accessing admin panel (AUTH-017, ADMIN-009)', () => {
    const adminAccess = Users.access?.admin
    if (typeof adminAccess !== 'function') {
      assert.fail('Users.access.admin is not defined!')
    }

    const customerReq = {
      req: {
        user: { id: 'cust-123', email: 'customer@example.com', role: 'customer' },
      },
    } as any

    const isAllowed = adminAccess(customerReq)
    assert.equal(Boolean(isAllowed), false, 'Users with role "customer" MUST be denied access to admin panel')
  })

  it('grants admin access to users with role "admin"', () => {
    const adminAccess = Users.access?.admin
    if (typeof adminAccess !== 'function') {
      assert.fail('Users.access.admin is not defined!')
    }

    const adminReq = {
      req: {
        user: { id: 'admin-1', email: 'admin@lovixacosmetic.com', role: 'admin' },
      },
    } as any

    const isAllowed = adminAccess(adminReq)
    assert.equal(Boolean(isAllowed), true, 'Admin role MUST be permitted')
  })

  it('grants admin access to store managers with role "staff"', () => {
    const adminAccess = Users.access?.admin
    if (typeof adminAccess !== 'function') {
      assert.fail('Users.access.admin is not defined!')
    }

    const staffReq = {
      req: {
        user: { id: 'staff-1', email: 'manager@lovixacosmetic.com', role: 'staff' },
      },
    } as any

    const isAllowed = adminAccess(staffReq)
    assert.equal(Boolean(isAllowed), true, 'Staff role MUST be permitted')
  })
})
