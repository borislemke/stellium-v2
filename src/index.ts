import 'source-map-support/register'
import 'reflect-metadata'
import './dev'
import * as Raven from 'raven'
import * as express from 'express'
import { Application } from 'express'
import { ApiRouter } from './api/index'
import { WebRouter } from './router/index'
import { RegistryMiddleware } from './registry/index'
import { StaticFilesHandler } from './helpers/static_files'
import { errorHandler } from './error_handler'
import { Bootstrap } from './bootstrap'

Raven.config(process.env.SENTRY_DNS).install()

// Main express RootApp
export const RootApp: Application = express()

RootApp.use(Raven.requestHandler())

/**
 * Registry Middleware for checking whether the domain is a registered domain
 * with Stellium.
 */
/**
 * TODO(production): Move to Kong / Go
 * @date - 13-08-2017
 * @time - 14:33
 */
RootApp.use(RegistryMiddleware)

// API Router
RootApp.use('/api', ApiRouter)

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
