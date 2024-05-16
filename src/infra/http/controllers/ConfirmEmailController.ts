import { Request, Response } from 'express'
import { ConfirmEmail } from '../../../core/usecases/ConfirmEmail'
import { ResourceNotFoundError } from '../../../core/errors/ResourceNotFoundError'
import { AccountAlreadyConfirmedError } from '../../../core/errors/AccountAlreadyConfirmedError'

export class ConfirmEmailController {
  async handle(request: Request, reply: Response) {
    try {
      const { publicId } = request.params

      const confirmEmail = new ConfirmEmail()
      await confirmEmail.execute({ publicId })

      return reply.status(301).redirect('http://localhost:8080/success')
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        return reply.status(404).json(err.message)
      }

      if (err instanceof AccountAlreadyConfirmedError) {
        return reply.status(400).json(err.message)
      }

      return reply.status(400).json(err)
    }
  }
}
