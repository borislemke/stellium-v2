import { Request, Response, NextFunction } from 'express'

export const templateStaticMiddleware = (req: Request, res: Response, next: NextFunction) => {

  var uid = req.params.uid,
    path = req.params[0] ? req.params[0] : 'index.html'
  res.sendfile(path, {root: './public'})
}
