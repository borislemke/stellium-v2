import { Router } from 'express'
import { AuthMiddleware } from '../auth_middleware'
import { loginCustomer } from './login_customer'
import { registerCustomer } from './register_customer'
import { recoveryEmail } from './forgot_password'
import { terminateSubscription } from './terminate_subscription'
import { resetPassword } from './reset_password'
import { refreshToken } from './refresh_token'

/**
 * This is the API that controls client account management, from registration
 * to login to subscription handling .... blah
 * @type {Router}
 */
export const APICustardRouter: Router = Router()

APICustardRouter.post('/login', loginCustomer)

APICustardRouter.post('/register', registerCustomer)

APICustardRouter.post('/recovery', recoveryEmail)

APICustardRouter.post('/reset', resetPassword)

/**
 * TODO(feature): Implement server side logout
 * @date - 26-08-2017
 * @time - 19:12
 */
APICustardRouter.post('/logout', resetPassword)

APICustardRouter.use(AuthMiddleware)

APICustardRouter.post('/terminate', terminateSubscription)

APICustardRouter.post('/refresh', refreshToken)
