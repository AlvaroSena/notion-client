import { Request, Response } from 'express'
import { CreateSession } from '../../../core/usecases/CreateSession'
import { InvalidCredentialsError } from '../../../core/errors/InvalidCredentialsError'
import { z } from 'zod'

export class CreateSessionController {
  async handle(request: Request, reply: Response) {
    const createSessionBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    try {
      const { email, password } = createSessionBodySchema.parse(request.body)
      const createSession = new CreateSession()
      const token = await createSession.execute({ email, password })

      return reply.status(201).json(token)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return reply.status(400).json({ message: 'Validation error' })
      }

      if (err instanceof InvalidCredentialsError) {
        return reply.status(401).json(err.message)
      }

      return reply.status(400).json(err)
    }
  }
}
