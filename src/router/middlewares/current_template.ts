import { resolve } from 'path'
import { NextFunction, Request, Response } from 'express'
import { Globals } from '../../globals'
import { ReqKeys } from '../../helpers/request_keys'

export const currentTemplateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const {active_template} = req.app.locals[ReqKeys.RegistryObject]

  req.app.locals[ReqKeys.CurrentTemplate] = active_template

  req.app.locals[ReqKeys.CurrentTemplatePath] = resolve(Globals.TemplatesPath, active_template)

  next()
}
