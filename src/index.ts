import 'source-map-support/register'
import 'reflect-metadata'
import './dev'
import * as Raven from 'raven'
import * as express from 'express'
import { Application } from 'express'
import { WebRouter } from './router/index'
import { RegistryMiddleware } from './registry/index'
import { StaticFilesHandler } from './helpers/static_files'
import { errorHandler } from './error_handler'
import { Bootstrap } from './api/bootstrap'

Raven.config(process.env.SENTRY_DNS).install()

// Main express RootApp
export const RootApp: Application = express()

RootApp.use(Raven.requestHandler())

/**
 * TODO(production): Move to Kong / Go
 * @date - 13-08-2017
 * @time - 14:33
 */
/**
 * Registry Middleware for checking whether the domain is a registered domain
 * with Stellium.
 */
RootApp.use(RegistryMiddleware)

/**
 * TODO(prod): Move to 3rd party storage provider
 * @date - 27-08-2017
 * @time - 00:14
 */
RootApp.get('/theme-static/:themeName/*', StaticFilesHandler)

/**
 * TODO(prod): Serve stellium icon
 * @date - 31-07-2017
 * @time - 23:59
 */
// Some browsers will attempt to fetch a favicon for error pages
RootApp.get('/favicon.ico', (req, res) => {
  res.sendStatus(404)
})

// WEB Router
RootApp.use(WebRouter)

errorHandler(RootApp)

Bootstrap(RootApp)
