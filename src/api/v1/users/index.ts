import { SystemUserModel } from '../../../models/models/system_user'
import { Router } from 'express'
import { getUserById } from './show'

export const SystemUserRouter: Router = Router()

SystemUserRouter.get('/', async (req, res, next) => {
  try {
    const users = await SystemUserModel.find()

    res.send(users)
  } catch (err) {
    next(err)
  }
})

SystemUserRouter.get('/:userId', getUserById)
