import * as express from 'express'
import { Router } from 'express'
import * as bodyParser from 'body-parser'
import { V1Router } from './v1/index'

export const ApiRouter: Router = express.Router()

ApiRouter.use(bodyParser.json())

ApiRouter.use(
  '/v1',
  V1Router
)

ApiRouter.get('/', (req, res) => {
  res.send('Hello API')
})
