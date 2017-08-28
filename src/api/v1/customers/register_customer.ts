import * as crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { Delicate } from '../../../utils/assertion/index'
import { STATUS } from '../../../utils/response_code'
import { SystemUserModel } from '../../../models/models/system_user'
import { GlobalMailer } from '../../../mailer/index'
import { ArgusClient } from '../../../utils/argus'

/**
 * TODO(export): Export
 * @date - 23-08-2017
 * @time - 23:27
 */
export const generateSalt = (length = 64): string => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

export const Sha512 = (password: string, salt: string): { salt: string, hash: string } => {
  const hash = crypto.createHmac('sha512', salt)

  hash.update(password)

  return {
    salt,
    hash: hash.digest('hex')
  }
}

const customerDataSchema = {
  email: {
    required: true,
    type: 'string'
  },
  first_name: {
    required: true,
    type: 'string'
  },
  last_name: {
    required: true,
    type: 'string'
  },
  password: {
    required: true,
    type: 'string',
    min: 8
  },
  eula: {
    required_true: true
  }
}

export const registerCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const {err, asserted: customerData} = Delicate(req.body, customerDataSchema)

  if (err) {
    res.status(STATUS.BAD_REQUEST)
    return next(err)
  }

  const {salt, hash} = Sha512(customerData.password, generateSalt())

  customerData.salt = salt

  customerData.hash = hash

  try {
    await SystemUserModel.create(customerData)

    res.send('account registered successfully')

    try {
      await GlobalMailer('customers/post-register', customerData.email, {
        title: 'Registration Successful',
        user: customerData
      })
    } catch (err) {
      ArgusClient.send(err)
    }

  } catch (e) {
    try {
      const mongooseError = e.toJSON()

      if (mongooseError.code === 11000) {
        return void res.status(STATUS.CONFLICT).send('a user with that email already exists')
      }

    } catch (_e) {
      console.log('Not a mongoose error')
    }

    res.status(STATUS.INTERNAL_SERVER_ERROR)

    return next(e)
  }
}
