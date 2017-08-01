import { Router } from 'express'
import { APIClientRouter } from './clients/index'

export const V1Router: Router = Router()

/**
 * /clients
 */

V1Router.use(
  '/clients',
  APIClientRouter
)
