import { prisma } from '../../infra/prisma'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'

interface DeletePublicKeyRequest {
  publicKeyId: string
}

export class DeletePublicKey {
  async execute({ publicKeyId }: DeletePublicKeyRequest) {
    const publicKey = await prisma.publicKey.findUnique({
      where: {
        id: publicKeyId,
      },
    })

    if (!publicKey) {
      throw new ResourceNotFoundError()
    }
    const apiKeyId = publicKey.apiKeyId

    await prisma.publicKey.delete({
      where: {
        id: publicKeyId,
      },
    })

    await prisma.aPIKey.delete({
      where: {
        id: apiKeyId as string,
      },
    })
  }
}
