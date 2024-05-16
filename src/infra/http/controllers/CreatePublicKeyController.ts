import { Request, Response } from 'express'
import { CreatePublicKey } from '../../../core/usecases/CreatePublicKey'
import { ResourceNotFoundError } from '../../../core/errors/ResourceNotFoundError'

export class CreatePublicKeyController {
  async handle(request: Request, reply: Response) {
    const { id: userId } = request.sub
    const { secretKeyValue, databaseId } = request.body

    try {
      const createPublicKey = new CreatePublicKey()
      const publicKey = await createPublicKey.execute({
        secretKeyValue,
        databaseId,
        userId,
      })

      return reply.json(publicKey)
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).json(err.message)
      }

      return reply.status(400).json(err)
    }
  }
}
