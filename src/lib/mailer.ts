import nodemailer from 'nodemailer'

/**
 * SMTP transport for form-notification email (contact, applications, etc.).
 * True only when every required var is set — same isXConfigured() contract
 * as the rest of this kit. A form route should check this before attempting
 * to send, and fail loudly (500, not a silent drop) if a submission comes in
 * while unconfigured — see src/app/api/contact/route.ts.
 */
export const isSmtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS,
)

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  }
  return cachedTransporter
}

export async function sendMail(opts: { to: string; subject: string; text: string; replyTo?: string }): Promise<void> {
  if (!isSmtpConfigured) {
    throw new Error('SMTP is not configured (SMTP_HOST/PORT/USER/PASS) — cannot send mail.')
  }
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  })
}
