import { NextFunction, Request, Response } from 'express'

export const templateStaticMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const uid = req.params.uid

  const path = req.params[0] ? req.params[0] : 'index.html'

  res.sendfile(path, {root: './public'})
}
