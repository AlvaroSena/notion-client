import { Request, Response } from 'express'
import { QueryNotionDatabase } from '../../../core/usecases/QueryNotionDatabase'
import { ResourceNotFoundError } from '../../../core/errors/ResourceNotFoundError'

export class QueryNotionDatabaseController {
  async handle(request: Request, reply: Response) {
    const { publicKey } = request.body

    try {
      const queryNotionDatabase = new QueryNotionDatabase()
      const response = await queryNotionDatabase.execute({ publicKey })

      return reply.json(response)
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).json(err.message)
      }

      return reply.status(400).json(err)
    }
  }
}
