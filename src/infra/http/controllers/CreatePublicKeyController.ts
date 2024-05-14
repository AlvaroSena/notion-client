import { Request, Response } from 'express'
import { CreatePublicKey } from '../../../core/usecases/CreatePublicKey'

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
      return reply.status(400).json(err)
    }
  }
}
