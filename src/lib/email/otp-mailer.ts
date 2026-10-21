import nodemailer from 'nodemailer'

/**
 * Dedicated mailer for LOVIXA customer authentication & OTP verification
 * Uses SMTP (Gmail App Password) configured in .env
 */

let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (!cachedTransporter) {
    const port = Number(process.env.SMTP_PORT) || 465
    // Port 465 expects direct SSL/TLS handshake
    const isSecure = port === 465 || process.env.SMTP_SECURE === 'true'

    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER || 'lovixacosmetic@gmail.com',
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return cachedTransporter
}

export async function sendPasswordResetOtpEmail({
  to,
  otp,
  customerName,
}: {
  to: string
  otp: string
  customerName?: string
}): Promise<void> {
  const from = `${process.env.EMAIL_FROM_NAME || 'LOVIXA COSMETIC'} <${process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || 'lovixacosmetic@gmail.com'}>`
  const subject = `${otp} is your LOVIXA verification code`

  const displayName = customerName ? customerName.trim() : ''

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your LOVIXA Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2B1822;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF6F8; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 35px rgba(43, 24, 34, 0.08); border: 1px solid #F1E5EC;">
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #2B1822 0%, #4A233A 100%); padding: 34px 24px 28px 24px; text-align: center;">
              <div style="font-size: 22px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: #FFFFFF; margin-bottom: 4px;">
                LOVIXA
              </div>
              <div style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #E8C4D4; font-weight: 500;">
                Botanical Hair Care Essentials
              </div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 34px 30px 28px 30px; text-align: center;">
              <h1 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #2B1822;">
                Reset Your Password
              </h1>
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.6; color: #66525E;">
                ${displayName ? `Hello <strong>${displayName}</strong>,<br/>` : 'Hello,<br/>'}
                We received a request to reset your password. Use the verification code below to set your new password:
              </p>
              
              <!-- OTP Box -->
              <div style="margin: 20px auto 24px auto; padding: 18px 24px; background-color: #FAF4F7; border: 1.5px dashed #D9B3C7; border-radius: 14px; display: inline-block;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #6B2D5C; padding-left: 10px;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 0 0 10px 0; font-size: 13px; color: #8C7883;">
                ⏳ This code expires in <strong>10 minutes</strong>.
              </p>
              <p style="margin: 0; font-size: 12px; color: #A6949E; line-height: 1.5;">
                If you did not make this request, you can safely ignore this email. Your account remains completely secure.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF6F8; border-top: 1px solid #F1E5EC; padding: 20px 24px; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #8C7883; font-weight: 600; letter-spacing: 0.05em;">
                LOVIXA COSMETIC
              </p>
              <p style="margin: 0; font-size: 11px; color: #B3A4AD;">
                Questions? Reply to this email or visit <a href="https://lovixacosmetic.com" style="color: #6B2D5C; text-decoration: none; font-weight: 600;">lovixacosmetic.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `Your LOVIXA verification code is: ${otp}\n\nThis code is valid for 10 minutes.\nIf you did not request a password reset, please ignore this email.`

  const transporter = getTransporter()
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })
}

export async function sendContactInquiryNotificationEmail({
  name,
  email,
  phone,
  message,
}: {
  name: string
  email: string
  phone?: string
  message?: string
}): Promise<void> {
  const adminEmail = process.env.SMTP_USER || 'lovixacosmetic@gmail.com'
  const from = `${process.env.EMAIL_FROM_NAME || 'LOVIXA Store'} <${process.env.EMAIL_FROM_ADDRESS || adminEmail}>`
  const subject = `New Customer Inquiry: ${name} (${email})`

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #2B1822; background: #FAF6F8; padding: 24px;">
  <div style="max-width: 560px; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #E8C4D4;">
    <h2 style="color: #6B2D5C; margin-top: 0;">New Website Inquiry</h2>
    <p>A customer has submitted a message via the LOVIXA Contact page:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
      <tr><td style="padding: 8px 0; color: #6A5A63; font-weight: bold; width: 90px;">Name:</td><td style="padding: 8px 0; font-weight: bold; color: #2B1822;">${name}</td></tr>
      <tr><td style="padding: 8px 0; color: #6A5A63; font-weight: bold;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #6B2D5C;">${email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #6A5A63; font-weight: bold;">Phone:</td><td style="padding: 8px 0; color: #2B1822;">${phone || 'Not provided'}</td></tr>
    </table>
    <div style="margin-top: 16px; padding: 16px; background: #FAF6F8; border-radius: 12px; border-left: 4px solid #6B2D5C;">
      <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #2B1822;">${message ? message.replace(/\n/g, '<br/>') : 'No message provided'}</p>
    </div>
    <p style="margin-top: 20px; font-size: 11px; color: #8C7883;">You can view and manage all inquiries in Payload CMS Admin under <strong>Form Submissions</strong>.</p>
  </div>
</body>
</html>
  `.trim()

  const transporter = getTransporter()
  await transporter.sendMail({
    from,
    to: adminEmail,
    subject,
    html,
  })
}
