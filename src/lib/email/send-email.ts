import nodemailer from 'nodemailer'

const smtpTransporter =
  process.env.SMTP_HOST && process.env.SMTP_PORT
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
      })
    : null

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  customerName,
  grandTotal,
  items,
}: {
  to: string
  orderNumber: string
  customerName: string
  grandTotal: number
  items: Array<{ title: string; quantity: number; price: number }>
}) {
  const from = `${process.env.EMAIL_FROM_NAME || 'LOVIXA COSMETIC'} <${process.env.EMAIL_FROM_ADDRESS || 'lovixacosmetic@gmail.com'}>`
  const subject = `Order Confirmation #${orderNumber}`

  const itemsHtml = (items || [])
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.title} (x${item.quantity})</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Thank you for your order!</h1>
      <p style="color: #666; font-size: 15px;">Hi ${customerName}, we received your order <strong>#${orderNumber}</strong> and we're getting it ready for shipment.</p>
      
      <div style="margin: 24px 0; padding: 16px; background-color: #f8fafc; border-radius: 8px;">
        <h2 style="font-size: 16px; font-weight: 600; margin-top: 0;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${itemsHtml}
          <tr>
            <td style="padding: 12px 0 0 0; font-weight: 700;">Total Paid</td>
            <td style="padding: 12px 0 0 0; font-weight: 700; text-align: right;">$${grandTotal.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 13px; color: #888;">If you have any questions, reply directly to this email.</p>
    </div>
  `

  try {
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        return await resend.emails.send({ from, to, subject, html })
      } catch (e) {
        console.warn('Resend module unavailable, falling back to SMTP/simulation:', e)
      }
    }

    if (smtpTransporter) {
      return await smtpTransporter.sendMail({ from, to, subject, html })
    }

    console.log(`[Email Simulation] Order Confirmation #${orderNumber} to ${to}`)
    return { id: 'simulated_email_id' }
  } catch (err: any) {
    console.warn(`[Email Notice] Could not send confirmation email: ${err.message}. Order checkout unaffected.`)
    return { id: 'fallback_offline_id' }
  }
}
