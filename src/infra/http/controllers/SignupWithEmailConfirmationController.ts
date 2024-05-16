import { Request, Response } from 'express'
import { SignUpWithEmailConfirmation } from '../../../core/usecases/SignupWithEmailConfirmation'
import { EmailAlreadyTakenError } from '../../../core/errors/EmailAlreadyTakenError'
import { z } from 'zod'

export class SignupWithEmailConfirmationController {
  async handle(request: Request, reply: Response) {
    const signupWithEmailConfirmationBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    try {
      const { name, email, password } =
        signupWithEmailConfirmationBodySchema.parse(request.body)
      const signupWithEmailConfirmation = new SignUpWithEmailConfirmation()
      await signupWithEmailConfirmation.execute({ name, email, password })

      return reply.status(201).send()
    } catch (err) {
      if (err instanceof z.ZodError) {
        return reply.status(400).json({ message: 'Validation error' })
      }

      if (err instanceof EmailAlreadyTakenError) {
        return reply.status(409).json(err.message)
      }

      return reply.status(400).json(err)
    }
  }
}
