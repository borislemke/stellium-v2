import { Router } from 'express'

export const V1MediaRouter: Router = Router()

V1MediaRouter.get('/', (req, res) => {
  res.send([])
})

V1MediaRouter.post('/', (req, res) => {
  res.send([])
})
