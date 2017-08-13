import { NextFunction, Request, Response } from 'express'
import { HTTPStatusCode } from '../../utils/response_code'

export const filterGetOnlyMethods = (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET') {
    res
      .status(HTTPStatusCode.METHOD_NOT_ALLOWED)
      .send('request methods other than GET are not allowed inside the renderer')
    return
  }
  next()
}
