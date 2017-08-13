import * as moment from 'moment'
import { NextFunction, Request, Response } from 'express'
import { Delicate } from '../../../utils/assertion/index'
import { HTTPStatusCode } from '../../../utils/response_code'

const customerDataSchema = {
  email: {
    required: true,
    type: 'string'
  },
  full_name: {
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
    res.status(HTTPStatusCode.BAD_REQUEST)
    return next(err)
  }

  // const conflictingEmail = await ClientMod

  customerData.expired_at = moment().add(30, 'days').format('')

  res.send(customerData)
}
