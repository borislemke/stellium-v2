import * as moment from 'moment'
import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../../../utils/response_code'
import { SystemUserModel } from '../../../models/models/system_user'
import { Sha512 } from './register_customer'

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const {token, password, email} = req.body

  if (!email || !token || !password) {
    return void res.status(STATUS.BAD_REQUEST).send('Property `email` is required')
  }

  try {
    const user = await SystemUserModel.findOne({
      email,
      reset_password_token: token
    })

    if (!user) {
      return void res.sendStatus(STATUS.UNAUTHORIZED)
    }

    const isExpired = moment(user.reset_password_expiry).isBefore(moment())

    if (isExpired) {
      return void res.status(STATUS.UNAUTHORIZED).send('Reset link has expired')
    }

    const {hash} = Sha512(password, user.salt)

    try {
      await user.update({
        hash: hash,
        reset_password_token: null,
        reset_password_expiry: null
      })

      res.send('Password has been reset successfully')
    } catch (err) {
      next(err)
    }
  } catch (err) {
    next(err)
  }
}
