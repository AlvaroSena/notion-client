import { Request, Response } from 'express'
import { z } from 'zod'
import { DeletePublicKey } from '../../../core/usecases/DeletePublicKey'
import { ResourceNotFoundError } from '../../../core/errors/ResourceNotFoundError'

export class DeletePublicKeyController {
  async handle(request: Request, reply: Response) {
    const deletePublicKeyParamsSchema = z.object({
      publicKeyId: z.string().uuid(),
    })

    try {
      const { publicKeyId } = deletePublicKeyParamsSchema.parse(request.params)

      const deletePublicKey = new DeletePublicKey()
      await deletePublicKey.execute({ publicKeyId })

      return reply.status(204).send()
    } catch (err) {
      if (err instanceof z.ZodError) {
        return reply.status(400).json({ message: 'Validation error' })
      }

      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).json(err.message)
      }
    }
  }
}
