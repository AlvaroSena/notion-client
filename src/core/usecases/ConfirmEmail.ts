import { prisma } from '../../infra/prisma'
import { AccountAlreadyConfirmedError } from '../errors/AccountAlreadyConfirmedError'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'

interface ConfirmEmailRequest {
  publicId: string
}

export class ConfirmEmail {
  async execute({ publicId }: ConfirmEmailRequest) {
    const user = await prisma.user.findUnique({
      where: {
        publicId,
      },
      select: {
        id: true,
        isEmailConfirmed: true,
      },
    })

    if (user?.isEmailConfirmed) {
      throw new AccountAlreadyConfirmedError()
    }

    if (!user) {
      throw new ResourceNotFoundError()
    }

    await prisma.user.update({
      where: {
        publicId,
      },
      data: {
        isEmailConfirmed: true,
      },
    })
  }
}
