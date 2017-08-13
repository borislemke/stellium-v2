import { SystemUserModel } from '../../../../models/models/system_user'
import { Router } from 'express'
import { AsyncWrapper } from '../../../../utils/async_wrap'
import { getUserById } from './show'

export const SystemUserRouter: Router = Router()

SystemUserRouter.get('/', AsyncWrapper(async (req, res, next) => {
  const users = await SystemUserModel.find()
  res.send(users)
}))

SystemUserRouter.get('/:userId', AsyncWrapper(getUserById))
