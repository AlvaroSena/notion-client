import { Request, Response } from 'express'
import { z } from 'zod'
import { ResendEmailConfirmation } from '../../../core/usecases/ResendEmailConfirmation'
import { BadRequestError } from '../../../core/errors/BadRequestError'

export class ResendEmailConfirmationController {
  async handle(request: Request, reply: Response) {
    const resendEmailConfirmationBodySchema = z.object({
      publicId: z.string().uuid(),
    })

    try {
      const { publicId } = resendEmailConfirmationBodySchema.parse(request.body)

      const resendEmailConfirmation = new ResendEmailConfirmation()
      await resendEmailConfirmation.execute({ publicId })

      return reply.status(201).send()
    } catch (err) {
      if (err instanceof z.ZodError) {
        return reply.status(400).json({ message: 'Validation error' })
      }

      if (err instanceof BadRequestError) {
        return reply.status(400).json(err.message)
      }
    }
  }
}
