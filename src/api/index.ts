import * as express from 'express'
import { Router } from 'express'

export const apiRouter: Router = express.Router()

apiRouter.get('/', (req, res) => {
  res.send('Hello API')
})
