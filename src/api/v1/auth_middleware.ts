import * as jwt from 'jsonwebtoken'
import { STATUS } from '../../utils/response_code'
import { Globals } from '../../globals'
import { SystemUserModel } from '../../models/models/system_user'
import { NextFunction, Request, Response } from 'express'

export const VerifyTokenPromise = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, Globals.Env.secret, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded)
    })
  })
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers['authorization'] as string

  if (!authorization) {
    res.status(STATUS.UNAUTHORIZED).send('missing authorization token')
    return
  }

  if (!authorization.match(/^bearer /i)) {
    res.status(STATUS.BAD_REQUEST).send('token malformed')
    return
  }

  const token = authorization.replace(/^bearer /i, '')

  try {
    const decoded = await VerifyTokenPromise(token)

    try {
      const user = await SystemUserModel.findOne({_id: decoded.user_id}).lean()

      if (!user) {
        return void res.status(STATUS.UNAUTHORIZED).send('user not found')
      }

      req.user = {
        ...user,
        hash: undefined,
        salt: undefined,
        __v: undefined
      }

      next()
    } catch (err) {
      next(err)
    }

  } catch (err) {
    res.status(STATUS.UNAUTHORIZED)

    if (err.name === 'TokenExpiredError') {
      return void res.send('token has expired')
    }

    if (err.name === 'JsonWebTokenError') {
      return void res.send('token malformed')
    }

    void res.send()
  }
}
