import { prisma } from '../../infra/prisma'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { BadRequestError } from '../errors/BadRequestError'
import { transporter } from '../lib/nodemailer'
import { confirmationTemplate } from '../../emails/confirmationTemplate'

interface ResendEmailConfirmationRequest {
  publicId: string
}

export class ResendEmailConfirmation {
  async execute({ publicId }: ResendEmailConfirmationRequest) {
    const smtpUser = process.env.SMTP_USER as string

    const user = await prisma.user.findUnique({
      where: {
        publicId,
      },
    })

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const userEmailIsAlreadyConfirmed = user.isEmailConfirmed

    if (userEmailIsAlreadyConfirmed) {
      throw new BadRequestError('Email already confirmed')
    }

    await transporter.sendMail({
      from: smtpUser,
      to: user.email,
      subject: '[NotionClient] Email confirmation',
      html: confirmationTemplate.replace('{{publicId}}', user.publicId),
    })
  }
}
