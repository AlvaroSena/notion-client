import { prisma } from '../../infra/prisma'
import { EmailAlreadyTakenError } from '../errors/EmailAlreadyTakenError'
import { hash } from 'bcryptjs'
import { transporter } from '../lib/nodemailer'

interface SignUpWithEmailConfirmationRequest {
  name: string
  email: string
  password: string
}

export class SignUpWithEmailConfirmation {
  async execute({ name, email, password }: SignUpWithEmailConfirmationRequest) {
    const smtpUser = process.env.SMTP_USER as string

    const isEmailAlreadyTaken = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (isEmailAlreadyTaken) {
      throw new EmailAlreadyTakenError()
    }

    const passwordHash = await hash(password, 6)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })

    const htmlTemplate = `
      <html>
        <body>
          <h3>Hello Mr(s) ${name},</h3>
          <p>
            Thank you for creating your NotionClient account. <br>
            To complete your registration, click the link below: <br>
            <a href='http://localhost:8080/v1/users/confirm-email/${user.publicId}'>Confirm your account here</a> <br>
          </p>
        </body>
      </html>
    `

    await transporter.sendMail({
      from: smtpUser,
      to: email,
      subject: '[NotionClient] Email confirmation',
      html: htmlTemplate,
    })
  }
}
