import { NextFunction, Request, Response } from 'express'

export interface ClientAccount {
  id: string
  email: string
  username: string // used to generate first-time store id hash. fleava -> fleava.stellium.io
  store_name: string
  // timestamps
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

export interface IStelliumAssertion {
  [key: string]: {
    type?: string
    min?: number
    max?: number
    required?: boolean
    required_true?: boolean
  }
}

const errorMessages = [
  {
    type: 'type',
    message: 'Type of `:member` should be `:schema[type]` but here is `typeof:member`'
  },
  {
    type: 'min',
    message: ':member has to be at least :schema[min] long.'
  },
  {
    type: 'max',
    message: ':member must not exceed :schema[min] characters in length.'
  },
  {
    type: 'required',
    message: ':member is required.'
  },
  {
    type: 'required_true',
    message: ':member be true / positive.'
  }
]

const schema = {
  email: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    min: 8
  },
  full_name: {
    type: 'string'
  },
  eula: {
    type: 'boolean',
    required_true: true
  }
}

const isDefined = (target: any) => {
  return typeof target !== 'undefined'
}

const assertError = (errorMessage: string, assertionOperator: () => boolean): string => {
  return assertionOperator() ? null : errorMessage
}

export const StelliumAssertPayload = (target: any, schema: IStelliumAssertion): { err: any, asserted?: any } => {

  const assertedObject = {}

  for (const member in schema) {
    if (schema.hasOwnProperty(member)) {

      let assertionError

      if (isDefined(schema[member].type)) {
        // Type of `${member}` should be ${schema[member].type}
        // but here is `${typeof target[member]}`
        assertionError = assertError('Type Assertion', () => {
          return schema[member].type === typeof target[member]
        })
      }

      if (isDefined(schema[member].min)) {
        assertionError = assertError('Min Length Assertion', () => {
          return target[member].length >= schema[member].min
        })
      }

      if (isDefined(schema[member].max)) {
        assertionError = assertError('Max Length Assertion', () => {
          return target[member].length <= schema[member].max
        })
      }

      if (isDefined(schema[member].required)) {
        assertionError = assertError('Required Assertion', () => {
          return typeof target[member] !== 'undefined'
        })
      }

      if (isDefined(schema[member].required_true)) {
        assertionError = assertError('Required True Assertion', () => {
          return typeof target[member] === 'boolean' && target[member]
        })
      }

      // Return assertion error if error text has been
      // set (non-empty assertion error message)
      if (assertionError && assertionError.length) {
        return {err: new Error(assertionError)}
      }

      // Filter out asserted members only, leaving
      // redundant properties out of the object.
      assertedObject[member] = target[member]
    }
  }

  return {
    err: null,
    asserted: assertedObject
  }
}

export const registerClient = (req: Request, res: Response, next: NextFunction) => {

  const clientData = req.body

  const {err, asserted} = StelliumAssertPayload(clientData, schema)

  if (err) {

    console.log('err\n', err.message)

    return void res.sendStatus(500)
  }

  console.log('all good and asserted\n', asserted)
  res.send(asserted)
}
