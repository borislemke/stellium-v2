import { NextFunction, Request, Response } from 'express'
import { jwtTokenPromise } from './login_customer'

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user

  try {
    const token = await jwtTokenPromise({user_id: user._id})

    res.send({token, user})
  } catch (err) {
    next(err)
  }
}
