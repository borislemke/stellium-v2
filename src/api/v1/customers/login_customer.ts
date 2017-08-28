import * as jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { Delicate, DelicateSchema } from '../../../utils/assertion/index'
import { STATUS } from '../../../utils/response_code'
import { SystemUserModel } from '../../../models/models/system_user'
import { Sha512 } from './register_customer'
import { Globals } from '../../../globals'
import { DomainModel } from '../../../models/models/stellium_domain'

const loginSchema: DelicateSchema = {
  email: {
    type: 'string'
  },
  password: {
    type: 'string',
    min: 8
  }
}

export const jwtTokenPromise = (payload: string | Object, options = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, Globals.Env.secret, options, (err, token) => {
      if (err) {
        return reject(err)
      }
      resolve(token)
    })
  })
}

export const loginCustomer = async (req: Request, res: Response, next: NextFunction) => {
  const {err, asserted: loginData} = Delicate(req.body, loginSchema)

  if (err) {
    return void res.status(STATUS.BAD_REQUEST).send(err)
  }

  try {
    const user = await SystemUserModel
      .findOne({email: (loginData.email as string).toLowerCase()})

    const noMatch = () => res.status(STATUS.UNAUTHORIZED).send('incorrect username or password')

    if (!user) {
      return void noMatch()
    }

    const {hash} = Sha512(loginData.password, user.salt)

    if (hash !== user.hash) {
      return void noMatch()
    }

    try {
      const token = await jwtTokenPromise({user_id: user._id.toString()})

      const domains = await DomainModel.find({created_by: user._id}).select('-users -created_by')

      res.send({token, user, domains})
    } catch (err) {
      return next(err)
    }

  } catch (err) {
    return next(err)
  }
}
