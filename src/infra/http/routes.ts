import { Router } from 'express'
import { SignupWithEmailConfirmationController } from './controllers/SignupWithEmailConfirmationController'
import { ConfirmEmailController } from './controllers/ConfirmEmailController'
import { CreateSessionController } from './controllers/CreateSessionController'
import { CreatePublicKeyController } from './controllers/CreatePublicKeyController'
import { verifyToken } from './middlewares/verifyToken'
import { QueryNotionDatabaseController } from './controllers/QueryNotionDatabaseController'
import { ResendEmailConfirmationController } from './controllers/ResendEmailConfirmationController'
import { ListPublicKeysController } from './controllers/ListPublicKeysController'
import { DeletePublicKeyController } from './controllers/DeletePublicKeyController'

export const routes = Router()

const signupWithEmailConfirmationController =
  new SignupWithEmailConfirmationController()
const confirmEmailController = new ConfirmEmailController()
const createSessionController = new CreateSessionController()
const createPublicKeyController = new CreatePublicKeyController()
const queryNotionDatabaseController = new QueryNotionDatabaseController()
const resendEmailConfirmationController =
  new ResendEmailConfirmationController()
const listPublicKeysController = new ListPublicKeysController()
const deletePublicKeyDelete = new DeletePublicKeyController()

routes.post('/v1/users/sign-up', signupWithEmailConfirmationController.handle)
routes.get('/v1/users/confirm-email/:publicId', confirmEmailController.handle)
routes.post('/v1/sessions', createSessionController.handle)
routes.post('/v1/public-key', verifyToken, createPublicKeyController.handle)
routes.post('/v1/notion/database/query', queryNotionDatabaseController.handle)
routes.post(
  '/v1/users/resend/email-confirmation',
  resendEmailConfirmationController.handle,
)
routes.get('/v1/public-keys', verifyToken, listPublicKeysController.handle)
routes.delete(
  '/v1/public-keys/:publicKeyId/delete',
  verifyToken,
  deletePublicKeyDelete.handle,
)
