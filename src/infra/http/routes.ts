import { Router } from 'express'
import { SignupWithEmailConfirmationController } from './controllers/SignupWithEmailConfirmationController'
import { ConfirmEmailController } from './controllers/ConfirmEmailController'
import { CreateSessionController } from './controllers/CreateSessionController'
import { CreatePublicKeyController } from './controllers/CreatePublicKeyController'
import { verifyToken } from './middlewares/verifyToken'
import { QueryNotionDatabaseController } from './controllers/QueryNotionDatabaseController'

export const routes = Router()

const signupWithEmailConfirmationController =
  new SignupWithEmailConfirmationController()
const confirmEmailController = new ConfirmEmailController()
const createSessionController = new CreateSessionController()
const createPublicKeyController = new CreatePublicKeyController()
const queryNotionDatabaseController = new QueryNotionDatabaseController()

routes.post('/v1/users/sign-up', signupWithEmailConfirmationController.handle)
routes.post('/v1/users/confirm-email/:publicId', confirmEmailController.handle)
routes.post('/v1/sessions', createSessionController.handle)
routes.post('/v1/public-key', verifyToken, createPublicKeyController.handle)
routes.post('/v1/notion/database/query', queryNotionDatabaseController.handle)
