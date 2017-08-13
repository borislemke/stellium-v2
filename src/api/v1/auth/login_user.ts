import { NextFunction, Request, Response } from 'express'
import { Delicate, DelicateSchema } from '../../../utils/assertion/index'

const authFilter: DelicateSchema = {
  email: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  }
}

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const {err, asserted: authData} = Delicate(req.body, authFilter)

  if (err) {
    return next(err)
  }
}
