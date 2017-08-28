import { Router } from 'express'

export const V1SystemRouter: Router = Router()

V1SystemRouter.get('/fuck', async (req, res) => {
  // res.send(await SystemUserModel.find())
  throw new Error('fuck.js')
})
