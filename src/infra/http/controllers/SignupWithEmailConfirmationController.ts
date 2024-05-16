import { Request, Response } from 'express'
import { SignUpWithEmailConfirmation } from '../../../core/usecases/SignupWithEmailConfirmation'
import { EmailAlreadyTakenError } from '../../../core/errors/EmailAlreadyTakenError'

export class SignupWithEmailConfirmationController {
  async handle(request: Request, reply: Response) {
    const { name, email, password } = request.body

    try {
      const signupWithEmailConfirmation = new SignUpWithEmailConfirmation()
      await signupWithEmailConfirmation.execute({ name, email, password })

      return reply.status(201).send()
    } catch (err) {
      if (err instanceof EmailAlreadyTakenError) {
        return reply.status(409).json(err.message)
      }

      return reply.status(400).json(err)
    }
  }
}
