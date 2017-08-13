import { Router } from 'express'
import { BaseController } from './base_controller'

export const RouteResource = (resourceController: any): Router => {

  const router: Router = Router()

  const handler: BaseController = new resourceController()

  const attach = (method: string) => (rq, rs, nx) => handler.bootstrap(rq, rs, nx)[method]()

  router.get('/', attach('index'))

  router.get('/:modelId', attach('show'))

  router.post('/', attach('store'))

  router.put('/', attach('update'))

  router.delete('/:modelId', attach('destroy'))

  return router
}
