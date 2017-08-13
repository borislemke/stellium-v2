import { Router } from 'express'
import { SystemUserRouter } from './users/index'
import { AsyncWrapper } from '../../../utils/async_wrap'

export const V1SystemRouter: Router = Router()

V1SystemRouter.use('/users', SystemUserRouter)

V1SystemRouter.get('/fuck', AsyncWrapper(async (req, res) => {
  // res.send(await SystemUserModel.find())
  throw new Error('fuck.js')
}))
