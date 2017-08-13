import { NextFunction, Request, Response } from 'express'
import { RequestKeys } from '../_utils/request_keys'

export const LanguageMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.app.locals[RequestKeys.Language] = req.query['lang'] || 'en'
  next()
}
