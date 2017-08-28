import * as Raven from 'raven'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Router } from 'express'
import { V1Router } from './v1/index'
import { LanguageMiddleware } from './middlewares/language'
import { Bootstrap } from './bootstrap'
import { errorHandler } from '../error_handler'

const ApiApp = express()

const ApiRouter: Router = Router()

ApiRouter.use(Raven.requestHandler())

ApiRouter.use(bodyParser.urlencoded({extended: false}))

ApiRouter.use(bodyParser.json())

ApiRouter.use(LanguageMiddleware)

// ApiRouter.use('/v1', V1Router)
ApiRouter.use(V1Router)

ApiApp.use(ApiRouter)

errorHandler(ApiApp)

Bootstrap(ApiApp, true)
