import { resolve } from 'path'
import { NextFunction, Request, Response } from 'express'
import { Globals } from '../../globals'
import { RequestKeys } from '../../helpers/request_keys'

export const currentTemplateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  /**
   * TODO(production): Dynamic template selection
   * @date - 7/10/17
   * @time - 7:36 PM
   */
  req.app.locals[RequestKeys.CurrentTemplate] = 'fortress'
  req.app.locals[RequestKeys.CurrentTemplatePath] = resolve(Globals.TemplatesPath, 'fortress')
  next()
}
