import { Request, Response } from 'express'
import { QueryNotionDatabase } from '../../../core/usecases/QueryNotionDatabase'
import { ResourceNotFoundError } from '../../../core/errors/ResourceNotFoundError'
import { z } from 'zod'

export class QueryNotionDatabaseController {
  async handle(request: Request, reply: Response) {
    const queryNotionDatabaseBodySchema = z.object({
      publicKey: z.string(),
      query: z
        .object({
          property: z.string(),
          checkbox: z.object({
            equals: z.boolean(),
          }),
        })
        .optional(),
    })

    try {
      const { publicKey, query } = queryNotionDatabaseBodySchema.parse(
        request.body,
      )
      const queryNotionDatabase = new QueryNotionDatabase()
      const response = await queryNotionDatabase.execute({ publicKey, query })

      return reply.json(response)
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
