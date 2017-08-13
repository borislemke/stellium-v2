import * as Raven from 'raven'
import * as colors from 'colors'
import { Globals } from '../globals'

/**
 * Error logging and notifications system built on Sentry
 */
export class Argus {

  private _raven: Raven.Client

  requestHandler

  errorHandler

  constructor () {
    this._raven = Raven.config('https://77b9163cd3c84bfe840274e7e97c90c4:92ffee9b5c3646d4988640c2e17b6f67@sentry.io/202892').install()
    this.requestHandler = this._raven.requestHandler
    this.errorHandler = this._raven.errorHandler
  }

  /**
   * Wraps Sentry's original exception handler
   * @param {string | Error} message
   * @param {Error} error
   */
  send (message: string | Error, error?: Error) {
    if (typeof error === 'undefined') {
      error = message as Error
      message = 'Unhandled error'
    }

    if (Globals.Development) {
      console.log(
        colors.bgRed('Error caught by Argus'), '\n',
        message, '\n',
        colors.bgRed('Error caught by Argus')
      )
    }

    this._raven.captureException(error)
  }
}

export const ArgusClient: Argus = new Argus()
