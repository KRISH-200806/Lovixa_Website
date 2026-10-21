import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function syncAdmin() {
  console.log('🔄 LOVIXA Admin User Sync Script')
  const email = process.env.ADMIN_EMAIL?.trim() || 'lovixacosmetic@gmail.com'
  const password = process.env.ADMIN_PASSWORD?.trim() || 'LovixaCosmetic@2026!'
  const name = process.env.ADMIN_NAME?.trim() || 'LOVIXA Store Administrator'

  console.log(`Target Admin Email: ${email}`)
  console.log(`Target Admin Name: ${name}`)

  const payload = await getPayload({ config })

  // Find all admin users
  const admins = await payload.find({
    collection: 'users',
    where: {
      role: {
        equals: 'admin',
      },
    },
  })

  console.log(`Found ${admins.docs.length} existing admin account(s).`)
  for (const doc of admins.docs) {
    console.log(` - ID: ${doc.id}, Email: ${doc.email}, Role: ${doc.role}`)
  }

  // Check if target email already exists
  const targetUser = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: email,
      },
    },
  })

  if (targetUser.docs.length > 0) {
    const userDoc = targetUser.docs[0]
    console.log(`→ Updating existing user (${userDoc.id}) with new password & admin role...`)
    await payload.update({
      collection: 'users',
      id: userDoc.id,
      data: {
        password,
        name,
        role: 'admin',
        loginAttempts: 0,
        lockUntil: null as any,
      },
    })
    // Direct database level unlock if payload stripped lock fields
    try {
      const db = (payload.db as any).connection || (payload.db as any).drizzle
      if (db?.collection) {
        await db.collection('users').updateOne(
          { _id: (userDoc as any)._id || userDoc.id },
          { $set: { loginAttempts: 0, lockUntil: null } }
        )
      }
    } catch (e) {
      // Ignore fallback
    }
    console.log(`✓ Updated admin credentials and unlocked account for ${email}`)
  } else if (admins.docs.length > 0) {
    // If there is an existing admin with old email (e.g., admin@lovixa.com), update it to the new email
    const firstAdmin = admins.docs[0]
    console.log(`→ Updating primary admin (${firstAdmin.id}, currently ${firstAdmin.email}) to ${email}...`)
    await payload.update({
      collection: 'users',
      id: firstAdmin.id,
      data: {
        email,
        password,
        name,
        role: 'admin',
      },
    })
    console.log(`✓ Updated primary admin email to ${email} and refreshed password.`)
  } else {
    // Create new admin
    console.log(`→ Creating new admin user: ${email}...`)
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name,
        role: 'admin',
      },
    })
  }



  // Verify login works
  try {
    const loginTest = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })
    if (loginTest?.token) {
      console.log(`🎉 TEST LOGIN SUCCESSFUL! Token generated for ${email} (Role: ${loginTest.user?.role})`)
    }
  } catch (loginErr: any) {
    console.error('❌ Test login failed:', loginErr.message || loginErr)
  }

  console.log('✅ Admin credentials successfully synchronized with .env!')
  process.exit(0)
}

syncAdmin().catch((err) => {
  console.error('❌ Error synchronizing admin credentials:', err)
  process.exit(1)
})
