import { Router } from 'express'
import { V1ClientsRouter } from './clients/index'
import { APICustardRouter } from './custard/index'
import { HTTPStatusCode } from '../../utils/response_code'
import { V1SystemRouter } from './system/index'

export const V1Router: Router = Router()

V1Router.use(
  '/customers',
  APICustardRouter
)

/**
 * TODO(production): Implement token authorization
 * @date - 11-08-2017
 * @time - 21:23
 */
V1Router.use((req, res, next) => {
  const authorization = req.headers['authorization'] as string

  if (!authorization) {
    res.status(HTTPStatusCode.UNAUTHORIZED).send('missing authorization token')
    return
  }

  if (!authorization.match(/^Bearer /)) {
    res.status(HTTPStatusCode.BAD_REQUEST).send('token malformed')
    return
  }

  req.app.locals.user = authorization.replace('Bearer ', '')

  next()
})

V1Router.use(
  '/clients',
  V1ClientsRouter
)

V1Router.use(
  '/system',
  V1SystemRouter
)
