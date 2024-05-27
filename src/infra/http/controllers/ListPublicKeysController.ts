import { Request, Response } from 'express'
import { ListPublicKeys } from '../../../core/usecases/ListPublicKeys'

export class ListPublicKeysController {
  async handle(request: Request, reply: Response) {
    try {
      const { id: userId } = request.sub

      const listPublicKeys = new ListPublicKeys()
      const publicKeys = await listPublicKeys.execute({ userId })

      return reply.json(publicKeys)
    } catch (err) {}
  }
}
