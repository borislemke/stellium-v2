import { ServerSymbolKey, UriSymbolKey } from './globals'

export enum MidtransUri {
  Production = 'https://app.midtrans.com/',
  Sandbox = 'https://app.sandbox.midtrans.com/'
}

export enum MidtransEnv {
  Sandbox = '0',
  Production = '1'
}

export const SetServerKey = (key) => {
  if (typeof global === 'undefined') {
    throw new Error('Use of this library is for Node.js only. The browser environment is not compatible with this library. Use Snap.js instead.')
  }

  if (typeof global[ServerSymbolKey] !== 'undefined') {
    // Disallow setting the server key multiple times
    throw new Error('Cannot re-set Midtrans Server key after it has been set')
  }

  global[ServerSymbolKey] = key

  // Enforce immutability
  Object.freeze(global[ServerSymbolKey])
}

export const SetEnvironment = (env) => {
  const typeOf = typeof env

  if (typeOf !== 'string') {
    throw new Error('`env` must be of type MidtransEnv or a string. But here a `' + typeOf + '` was given.')
  }

  let uri: string

  switch (env) {
    case MidtransEnv.Production:
      uri = MidtransUri.Production
      break
    case MidtransEnv.Sandbox:
      uri = MidtransUri.Sandbox
      break
  }

  if (uri) {
    global[UriSymbolKey] = uri
  }
}
