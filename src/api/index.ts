import { Router } from 'express'
import * as bodyParser from 'body-parser'
import { V1Router } from './v1/index'
import { LanguageMiddleware } from './middlewares/language'

export const ApiRouter: Router = Router()

ApiRouter.use(bodyParser.urlencoded({extended: false}))

ApiRouter.use(bodyParser.json())

ApiRouter.use(LanguageMiddleware)

ApiRouter.use('/v1', V1Router)
