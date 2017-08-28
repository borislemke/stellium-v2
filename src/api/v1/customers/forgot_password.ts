import * as moment from 'moment'
import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../../../utils/response_code'
import { SystemUserModel } from '../../../models/models/system_user'
import { GlobalMailer } from '../../../mailer/index'
import { generateSalt } from './register_customer'
import { ArgusClient } from '../../../utils/argus'

export const recoveryEmail = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body['email']

  if (!email) {
    return void res.status(STATUS.BAD_REQUEST).send('Property `email` is required')
  }

  try {
    const user = await SystemUserModel.findOne({email})

    if (!user) {
      return void res.status(STATUS.NOT_FOUND).send('no user with that email found')
    }

    const token = generateSalt(16)

    user.reset_password_token = token

    user.reset_password_expiry = moment().add(24, 'hours').format()

    try {
      await user.save()

      try {
        await GlobalMailer('customers/recovery', 'dimas.lemke@midtrans.com', {
          title: 'Recovery Email',
          user: user
        })

        return void res.send('recovery email sent to ' + user.email)
      } catch (err) {
        next(err)
      }
    } catch (saveError) {
      next(saveError)
    }
  } catch (e) {
    next(e)
  }
}
