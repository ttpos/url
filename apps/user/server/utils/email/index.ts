/* eslint-disable node/prefer-global/process */
import nodemailer from 'nodemailer'

export * from './templates/email-verification'
export * from './templates/magic-link'
export * from './templates/reset-password-code'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NUXT_GMAIL_EMAIL_USER,
    pass: process.env.NUXT_GMAIL_EMAIL_PASSWORD,
  },
})

export async function sendEmail({
  html,
  subject,
  to,
}: {
  to: string
  subject: string
  html: string
}) {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore
  const _info = await transporter.sendMail({
    from: `"Nuxt Lucia Auth" <${process.env.NUXT_GMAIL_EMAIL_USER}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    // text: "Hello world?", // plain text body
    html, // html body
  })
}
