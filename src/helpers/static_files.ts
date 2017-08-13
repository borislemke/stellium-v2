import { Globals } from '../globals'
import { resolve } from 'path'
import { Request, Response } from 'express'

/**
 * TODO(opt): Optimize static file serves
 * @date - 27-07-2017
 * @time - 16:02
 */
export const StaticFilesHandler = (req: Request, res: Response): void => {

  const staticPath = resolve(Globals.TemplatesPath, req.params.themeName, 'public', req.params[0])

  res.sendFile(staticPath, err => {
    if (err) {
      res.sendStatus(err.status)
    }
  })
}
