import { prisma } from '../../infra/prisma'

interface ListPublicKeysRequest {
  userId: string
}

export class ListPublicKeys {
  async execute({ userId }: ListPublicKeysRequest) {
    const publicKeys = await prisma.publicKey.findMany({
      where: {
        userId,
      },
    })

    return {
      publicKeys,
    }
  }
}
