import nodemailer from 'nodemailer'

type TransportType = {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

const transport = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || ''),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as TransportType

export const transporter = nodemailer.createTransport(transport)
