import { Application } from 'express'
import * as Raven from 'raven'

export const errorHandler = (app: Application) => {

  app.use(Raven.errorHandler())

  // Optional fallthrough error handler
  app.use((error, req, res, next) => {
    console.log('final error\n', res.statusCode, error.message)

    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = res.statusCode || 500

    if (res.statusCode === 200) {
      res.statusCode = 500
    }

    const stringify = res.statusCode + ''

    if (stringify.startsWith('5')) {
      Raven.captureException(error)
    }

    if (res.statusCode === 404) {
      /**
       * TODO(prod): Not found renderer
       * @date - 16-08-2017
       * @time - 21:01
       */
      return void res.send('<h1>Page Not Found</h1>')
    }

    console.log('res.sentry\n', res.sentry)

    res.send(error.message)
  })
}
