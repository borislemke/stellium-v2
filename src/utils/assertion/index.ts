import { AssertionMessages } from './messages'

export interface DelicateSchema {
  [key: string]: {
    type?: string
    min?: number
    max?: number
    required?: boolean
    required_true?: boolean
  }
}

const getErrorMessageByKey = (key: string): string => {
  const errorPair = AssertionMessages.find(_msg => _msg.type === key)
  if (!errorPair) {
    return 'Invalid data for key :member'
  }
  return errorPair.message
}

const isDefined = (target: any) => {
  return typeof target !== 'undefined'
}

const assertError = (assertionType: string, assertionOperator: () => boolean): string => {
  if (assertionOperator()) {
    return null
  }

  return getErrorMessageByKey(assertionType)
}

export const Delicate = <T>(target: any, schema: DelicateSchema): { err?: Error, asserted?: T & DelicateSchema } => {

  const asserted = {}

  for (const member in schema) {

    if (schema.hasOwnProperty(member)) {

      let assertionError

      if (isDefined(schema[member].required)) {
        assertionError = assertError('required', () => {
          return typeof target[member] !== 'undefined'
        })
        if (assertionError) {
          assertionError = assertionError
            .replace(/:member/i, member)
        }
      }

      if (isDefined(schema[member].type)) {
        assertionError = assertError('type', () => {
          return schema[member].type === typeof target[member]
        })
        if (assertionError) {
          assertionError = assertionError
            .replace(/:member\[type]/i, schema[member].type)
            .replace(/:target\[type]/i, typeof target[member])
            .replace(/:member/i, member)
        }
      }

      if (isDefined(schema[member].min)) {
        assertionError = assertError('min', () => {
          return target[member].length >= schema[member].min
        })
        if (assertionError) {
          assertionError = assertionError
            .replace(/:member\[length]/i, schema[member].min)
            .replace(/:member/i, member)
        }
      }

      if (isDefined(schema[member].max)) {
        assertionError = assertError('max', () => {
          return target[member].length <= schema[member].max
        })
        if (assertionError) {
          assertionError = assertionError
            .replace(/:member\[length]/i, schema[member].max)
            .replace(/:member/i, member)
        }
      }

      if (isDefined(schema[member].required_true)) {
        assertionError = assertError('required_true', () => {
          return typeof target[member] === 'boolean' && target[member]
        })
        if (assertionError) {
          assertionError = assertionError
            .replace(/:member/i, member)
        }
      }

      // Return assertion error if error text has been
      // set (non-empty assertion error message)
      if (assertionError && assertionError.length) {
        return {err: new Error(assertionError)}
      }

      // Filter out asserted members only, leaving
      // redundant properties out of the object.
      asserted[member] = target[member]
    }
  }

  return ({asserted} as DelicateSchema)
}
