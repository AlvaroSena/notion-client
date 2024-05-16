import { Request, Response } from 'express'
import { CreatePublicKey } from '../../../core/usecases/CreatePublicKey'
import { ResourceNotFoundError } from '../../../core/errors/ResourceNotFoundError'
import { z } from 'zod'

export class CreatePublicKeyController {
  async handle(request: Request, reply: Response) {
    const createPublicKeySubSchema = z.object({
      id: z.string().uuid(),
    })

    const createPublicKeyBodySchema = z.object({
      secretKeyValue: z.string(),
      databaseId: z.string(),
    })

    try {
      const { id: userId } = createPublicKeySubSchema.parse(request.sub)
      const { secretKeyValue, databaseId } = createPublicKeyBodySchema.parse(
        request.body,
      )
      const createPublicKey = new CreatePublicKey()
      const publicKey = await createPublicKey.execute({
        secretKeyValue,
        databaseId,
        userId,
      })

      return reply.json(publicKey)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return reply.status(400).json({ message: 'Validation error' })
      }

      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).json(err.message)
      }

      return reply.status(400).json(err)
    }
  }
}
