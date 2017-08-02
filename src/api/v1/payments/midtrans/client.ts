import * as request from 'request'
import { MidtransEnv, SetEnvironment, SetServerKey } from './environment'
import { ServerSymbolKey, UriSymbolKey } from './globals'

export interface TokenPromise {
  err?: any
  token?: string
}

export class Midtrans {

  public static get _createAuthString (): string {
    // Encodes the server key into base64 to satisfy the 'Basic Auth' format
    return new Buffer(Midtrans.ServerKey + ':').toString('base64')
  }

  public static get _serverUri (): string {
    // Returns the API URI set by assigning Midtrans.Env
    return global[UriSymbolKey]
  }

  public static get _baseRequestHeader (): any {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + this._createAuthString
    }
  }

  public static async createToken (): Promise<TokenPromise> {
    return new Promise(resolve => {

      request.post(this._serverUri + 'snap/v1/transactions', {
        headers: this._baseRequestHeader,
        json: {
          transaction_details: {
            order_id: Date.now(),
            gross_amount: 145000
          }
        }
      }, (err, httpResponse, body) => {
        if (err) {
          resolve({err})
          return
        }

        const statusCode = httpResponse.statusCode

        if (('' + statusCode).match('^20')) {
          if (body && body.token) {
            resolve({
              token: body.token
            })
            return
          }
        }

        if (body.error_messages) {
          resolve({
            err: body.error_messages
          })
          return
        }

        err = new Error('Unknown server response')

        resolve({err})
      })
    })
  }

  public static set ServerKey (key: string) {
    SetServerKey(key)
  }

  public static get ServerKey (): string {
    const key = global[ServerSymbolKey]

    if (typeof key === 'undefined') {
      throw new Error('Server key has not been set. Set it with `Midtrans.ServerKey = \'Your-Server-Key\'`')
    }

    return key
  }

  public static set Environment (env: MidtransEnv) {
    SetEnvironment(env)
  }
}
