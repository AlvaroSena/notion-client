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
    const isEmailAlreadyTaken = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (isEmailAlreadyTaken) {
      throw new EmailAlreadyTakenError()
    }

    const passwordHash = await hash(password, 6)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })

    await transporter.sendMail({
      from: 'alvarosenacs.c@gmail.com',
      to: email,
      subject: 'Email confirmation',
      html: `<p>
        Hello!
        <br>
        Thank you for creating your NotionClient account.
        <br>
        To complete your registration, click the link below:
        <a href="">Confirm your account</a>
        <br>
        Yours truly,
        The NotionClient Team
        <a href="">https://www.notionclient.com</a>
      </p>`,
    })
  }
}
