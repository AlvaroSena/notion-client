import { Request, Response } from 'express'
import { CreateSession } from '../../../core/usecases/CreateSession'
import { InvalidCredentialsError } from '../../../core/errors/InvalidCredentialsError'

export class CreateSessionController {
  async handle(request: Request, reply: Response) {
    const { email, password } = request.body

    try {
      const createSession = new CreateSession()
      const token = await createSession.execute({ email, password })

      return reply.status(201).json(token)
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return reply.status(401).json(err.message)
      }

      return reply.status(400).json(err)
    }
  }
}
