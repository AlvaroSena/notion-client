import { prisma } from '../../infra/prisma'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import crypto from 'node:crypto'

interface CreatePublicKeyRequest {
  secretKeyValue: string
  databaseId: string
  userId: string
}

export class CreatePublicKey {
  async execute({
    secretKeyValue,
    databaseId,
    userId,
  }: CreatePublicKeyRequest) {
    const APIKey = await prisma.aPIKey.create({
      data: {
        value: secretKeyValue,
        notionDatabaseId: databaseId,
        userId,
      },
    })

    if (!APIKey) {
      throw new ResourceNotFoundError()
    }

    const key = crypto.randomUUID()
    const publicKeyValue = 'public_'.concat(key)

    const publicKey = await prisma.publicKey.create({
      data: {
        value: publicKeyValue,
        apiKeyId: APIKey.id,
      },
    })

    return {
      publicKey,
    }
  }
}
