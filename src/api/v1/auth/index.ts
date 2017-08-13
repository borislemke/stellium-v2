import { Router } from 'express'
import { loginUser } from './login_user'

export const V1AuthRouter: Router = Router()

V1AuthRouter.post('/login', loginUser)
