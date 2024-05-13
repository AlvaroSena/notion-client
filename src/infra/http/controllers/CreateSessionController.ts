import { Request, Response } from 'express'
import { CreateSession } from '../../../core/usecases/CreateSession'

export class CreateSessionController {
  async handle(request: Request, reply: Response) {
    const { email, password } = request.body

    try {
      const createSession = new CreateSession()
      const token = await createSession.execute({ email, password })

      return reply.status(201).json(token)
    } catch (err) {
      return reply.status(400).json(err)
    }
  }
}
