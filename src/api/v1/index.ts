import { Router } from 'express'
import { V1ClientsRouter } from './clients/index'
import { APICustardRouter } from './customers/index'
import { V1SystemRouter } from './system/index'
import { AuthMiddleware } from './auth_middleware'
import { V1DomainsRouter } from './domains/index'
import { SystemUserRouter } from './users/index'
import { V1PagesRouter } from './pages/index'
import { V1MediaRouter } from './media/index'

export const V1Router: Router = Router()

V1Router.use('/customers', APICustardRouter)

V1Router.use(AuthMiddleware)

V1Router.use('/domains', V1DomainsRouter)

V1Router.use('/pages', V1PagesRouter)

V1Router.use('/clients', V1ClientsRouter)

V1Router.use('/media/media', V1MediaRouter)

V1Router.use('/settings', V1MediaRouter)

V1Router.use('/system', V1SystemRouter)

V1Router.use('/users', SystemUserRouter)
