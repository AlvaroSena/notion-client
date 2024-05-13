import { Router } from 'express'
import { SignupWithEmailConfirmationController } from './controllers/SignupWithEmailConfirmationController'
import { ConfirmEmailController } from './controllers/ConfirmEmailController'
import { CreateSessionController } from './controllers/CreateSessionController'

export const routes = Router()

const signupWithEmailConfirmationController =
  new SignupWithEmailConfirmationController()
const confirmEmailController = new ConfirmEmailController()
const createSessionController = new CreateSessionController()

routes.post('/v1/users/sign-up', signupWithEmailConfirmationController.handle)
routes.post('/v1/users/confirm-email/:publicId', confirmEmailController.handle)
routes.post('/v1/sessions', createSessionController.handle)
