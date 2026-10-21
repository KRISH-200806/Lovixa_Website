/**
 * Fails fast, with a clear message naming exactly what's wrong, if a
 * required environment variable is missing, empty, still set to the
 * .env.example placeholder, reused across the three secrets that must
 * differ, or a DATABASE_URL whose scheme doesn't match the DB adapter this
 * project is actually wired for — instead of booting into a silently
 * insecure state (e.g. `secret: process.env.PAYLOAD_SECRET || ''` signing
 * every admin auth token with an empty string) or surfacing a mismatched
 * adapter/URL as a cryptic driver-level connection error minutes later
 * (e.g. the Postgres driver trying to open a `mongodb+srv://` host as a
 * plain TCP address). See starter-kit/20-security-hardening.md.
 *
 * Call validateEnv(dbKind) once, at the top of payload.config.ts, passing
 * whichever adapter that file actually configures ('postgres' by default;
 * setup.sh's MongoDB branch patches the call to 'mongodb') — every entry
 * point that matters (next dev, next build, payload migrate, payload
 * generate:types) loads that file, so this runs before anything else does.
 */
import { z } from 'zod'

const PLACEHOLDER_SECRET = 'CHANGE_ME_GENERATE_WITH_openssl_rand_hex_32'

const REQUIRED_SECRETS = ['PAYLOAD_SECRET', 'REVALIDATE_SECRET', 'SETUP_SECRET'] as const

export type DbKind = 'postgres' | 'mongodb'

// Recognized connection-string schemes per adapter, for the mismatch check
// below. Keep in sync with whatever setup.sh writes into .env.example.
const DB_URL_SCHEMES: Record<DbKind, { patterns: RegExp[]; example: string }> = {
  postgres: { patterns: [/^postgres(ql)?:\/\//i], example: 'postgresql://user:pass@host:5432/dbname' },
  mongodb: { patterns: [/^mongodb(\+srv)?:\/\//i], example: 'mongodb://host:27017/dbname or mongodb+srv://...' },
}

// Coerces a missing/non-string value (undefined) to '' first, so a var
// that's entirely unset and one that's set to '' both fail the same
// .min(1) check with the same message, instead of the unset case hitting
// zod's generic "expected string, received undefined" instead.
const requiredString = (message: string) =>
  z.preprocess((val) => (typeof val === 'string' ? val : ''), z.string().min(1, message))

const envSchema = z.object({
  DATABASE_URL: requiredString('is not set — see .env.example.'),
  PAYLOAD_SECRET: requiredString('is not set — see .env.example.'),
  REVALIDATE_SECRET: requiredString('is not set — see .env.example.'),
  SETUP_SECRET: requiredString('is not set — see .env.example.'),
})

export function validateEnv(dbKind: DbKind = 'postgres'): void {
  const result = envSchema.safeParse(process.env)

  const issues: string[] = []
  if (!result.success) {
    for (const issue of result.error.issues) {
      issues.push(`  - ${issue.path.join('.')}: ${issue.message}`)
    }
  }

  const env = result.success ? result.data : undefined

  if (env) {
    for (const key of REQUIRED_SECRETS) {
      if (env[key] === PLACEHOLDER_SECRET) {
        issues.push(`  - ${key}: is still the .env.example placeholder — generate a real value with \`openssl rand -hex 32\`.`)
      }
    }

    // Only compare the three for uniqueness once each has individually
    // passed its own presence check — otherwise three vars that are all
    // simply unset (all '') trivially "match", which would misleadingly
    // report a reuse problem on top of the already-clear "not set" issues.
    const values = REQUIRED_SECRETS.map((key) => env[key])
    const allPresent = values.every((v) => v.length > 0)
    if (allPresent && new Set(values).size !== values.length) {
      issues.push(
        '  - PAYLOAD_SECRET/REVALIDATE_SECRET/SETUP_SECRET: must all be different values — never reuse one for another.',
      )
    }

    // Catches the #1 cause of a confusing runtime crash: the project is
    // wired for one DB adapter (postgresAdapter or mongooseAdapter, chosen
    // once by setup.sh) but DATABASE_URL holds a connection string for the
    // other database — e.g. a MongoDB Atlas URI pasted in while the code is
    // still on @payloadcms/db-postgres. Without this check that surfaces as
    // an opaque driver-level error (ENOTFOUND, auth failure, etc.) instead
    // of naming the actual problem.
    if (env.DATABASE_URL.length > 0) {
      const expected = DB_URL_SCHEMES[dbKind]
      const matchesExpected = expected.patterns.some((re) => re.test(env.DATABASE_URL))
      if (!matchesExpected) {
        const other = (Object.keys(DB_URL_SCHEMES) as DbKind[]).find(
          (kind) => kind !== dbKind && DB_URL_SCHEMES[kind].patterns.some((re) => re.test(env.DATABASE_URL)),
        )
        const looksLike = other ? ` It looks like a ${other} connection string.` : ''
        issues.push(
          `  - DATABASE_URL: this project is configured for ${dbKind} (payload.config.ts), but the URL doesn't look like a ${dbKind} connection string.${looksLike} Expected shape: ${expected.example}`,
        )
      }
    }
  }

  if (issues.length === 0) return

  throw new Error(
    `\n\nEnvironment validation failed — refusing to start.\n\n${issues.join('\n')}\n\n` +
      'Copy .env.example to .env and set real values (see starter-kit/README.md "Quick start").\n',
  )
}
