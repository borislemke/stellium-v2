import { Router } from 'express'
import { registerCustomer } from './register_customer'
import { loginCustomer } from './login_customer'
import { terminateSubscription } from './terminate_subscription'

/**
 * Custard is the API that controls client account management, from registration
 * to subscription handling .... blah
 * @type {Router}
 */
export const APICustardRouter: Router = Router()

APICustardRouter.post('/login', loginCustomer)

APICustardRouter.post('/register', registerCustomer)

APICustardRouter.post('/terminate', terminateSubscription)
