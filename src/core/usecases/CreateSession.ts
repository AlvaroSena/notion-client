import { compare } from 'bcryptjs'
import { prisma } from '../../infra/prisma'
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError'
import { sign } from 'jsonwebtoken'

interface CreateSessionRequest {
  email: string
  password: string
}

export class CreateSession {
  async execute({ email, password }: CreateSessionRequest) {
    const secret = process.env.JWT_SECRET as string
    const expiresIn = process.env.JWT_EXPIRES_IN as string

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatched = await compare(password, user.passwordHash)

    if (!passwordMatched) {
      throw new InvalidCredentialsError()
    }

    const token = await sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    return {
      accessToken: token,
      user: {
        name: user.name,
        email: user.email,
      },
    }
  }
}
