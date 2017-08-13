import { resolve } from 'path'
import { NextFunction, Request, Response } from 'express'
import { Globals } from '../../globals'
import { RequestKeys } from '../../helpers/request_keys'

export const currentTemplateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const {active_template} = req.app.locals[RequestKeys.RegistryObject]

  req.app.locals[RequestKeys.CurrentTemplate] = active_template

  req.app.locals[RequestKeys.CurrentTemplatePath] = resolve(Globals.TemplatesPath, active_template)

  next()
}
