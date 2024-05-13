import { Router } from 'express'
import { SignupWithEmailConfirmationController } from './controllers/SignupWithEmailConfirmationController'

export const routes = Router()

const signupWithEmailConfirmationController =
  new SignupWithEmailConfirmationController()

routes.post('/v1/users/sign-up', signupWithEmailConfirmationController.handle)
