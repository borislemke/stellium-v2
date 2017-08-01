import 'source-map-support/register'
import './dev'
import * as express from 'express'
import { Application } from 'express'
import * as mongoose from 'mongoose'
import { ConnectionOptions } from 'mongoose'
import { ApiRouter } from './api/index'
import { WebRouter } from './router/index'
import { RegistryMiddleware } from './registry/index'
import { StaticFilesHandler } from './helpers/static_files'
import { RaygunClient } from './utils/raygun'

// Main express app
const app: Application = express()

// Raygun middleware to log request errors
app.use(RaygunClient.expressHandler)

/**
 * Registry Middleware for checking whether the domain is a registered domain
 * with Stellium.
 */
app.use(RegistryMiddleware)

// API Router
app.use(
  '/api',
  ApiRouter
)

app.get(
  '/theme-static/:themeName/*',
  StaticFilesHandler
)

/**
 * TODO(prod): Serve stellium icon
 * @date - 31-07-2017
 * @time - 23:59
 */
// Some browsers will attempt to fetch a favicon for error pages
app.get('/favicon.ico', (req, res) => {
  res.sendStatus(404)
})

// WEB Router
app.use(WebRouter)

let port: string = process.env.SERVICE_PORT

  /**
   * The default mongoose.Promise is deprecated. For whatever reason it has not been
   * replaced by the developers until now so we have to plug in the native Promise
   * library as it's replacement.
   * @type {Function}
   */
;(mongoose as any).Promise = global.Promise

const connectionHandler = (err: any) => {

  port || (port = '3000')
  if (err) {
    throw err
  }

  app.listen(port, () => console.log('Server listening on port:', port))
}

const databaseName = process.env.DATABASE_NAME || 'growbali-dev'

mongoose.connect(
  'mongodb://localhost/' + databaseName,
  {useMongoClient: true} as ConnectionOptions,
  err => connectionHandler(err)
)
