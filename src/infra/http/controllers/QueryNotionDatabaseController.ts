import { Request, Response } from 'express'
import { QueryNotionDatabase } from '../../../core/usecases/QueryNotionDatabase'

export class QueryNotionDatabaseController {
  async handle(request: Request, reply: Response) {
    const { publicKey } = request.body

    try {
      const queryNotionDatabase = new QueryNotionDatabase()
      const response = await queryNotionDatabase.execute({ publicKey })

      return reply.json(response)
    } catch (err) {
      return reply.status(400).json(err)
    }
  }
}
