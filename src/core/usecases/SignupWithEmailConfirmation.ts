import { prisma } from '../../infra/prisma'
import { EmailAlreadyTakenError } from '../errors/EmailAlreadyTakenError'
import { hash } from 'bcryptjs'
import { transporter } from '../lib/nodemailer'
import { confirmationTemplate } from '../../emails/confirmationTemplate'

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

    await transporter.sendMail({
      from: smtpUser,
      to: email,
      subject: '[NotionClient] Email confirmation',
      html: confirmationTemplate.replace('{{publicId}}', user.publicId),
    })

    return {
      publicId: user.publicId,
    }
  }
}
