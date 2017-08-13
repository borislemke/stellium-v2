import { Application } from 'express'
import * as Raven from 'raven'

export const errorHandler = (app: Application) => {

  app.use(Raven.errorHandler())

  // Optional fallthrough error handler
  app.use((error, req, res, next) => {
    console.log('final error\n', error.message)
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = res.statusCode || 500
    if ((res.statusCode + '').match('^5')) {
      Raven.captureException(error)
    }
    console.log('res.sentry\n', res.sentry)
    res.send(error.message)
  })
}
