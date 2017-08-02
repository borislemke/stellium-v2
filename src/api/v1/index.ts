import { Router } from 'express'
import { APIClientRouter } from './clients/index'
import { APIPaymentsRouter } from './payments/index'

export const V1Router: Router = Router()

/**
 * /clients
 */

V1Router.use(
  '/clients',
  APIClientRouter
)

V1Router.use(
  '/payments',
  APIPaymentsRouter
)
