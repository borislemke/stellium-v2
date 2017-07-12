import { resolve } from 'path'
import * as async from 'async'
import { Request } from 'express'
import { templateRenderer } from './template_renderer'
import { Globals } from '../../globals'
import { stylesheetCompiler } from './stylesheet_compiler'
import { RequestKeys } from '../../helpers/request_keys'
import { scriptsCompiler } from './scripts_compiler'

let _moduleId = 0

const moduleIdCache = {}

const getModuleId = (templateName: string): string => {

  if (moduleIdCache[templateName]) {
    return moduleIdCache[templateName]
  } else {
    moduleIdCache[templateName] = 'xyz-' + ++_moduleId
    return moduleIdCache[templateName]
  }
}

export const ModuleRenderer = (pageData: any, req: Request) => (moduleData: any, cb: (err: any, resolvedModule?: any) => void): void => {

  moduleData.templateName = moduleData.template

  const currentTemplate = req.app.locals[RequestKeys.CurrentTemplate]

  moduleData.template = resolve(Globals.TemplatesPath, currentTemplate, 'modules', moduleData.template)

  moduleData.moduleId = getModuleId(moduleData.templateName)

  async.series({
    styles: stylesheetCompiler(moduleData),
    template: templateRenderer(pageData, moduleData, req),
    scripts: scriptsCompiler(moduleData)
  }, (err, resolvedModule) => {

    resolvedModule.templateName = moduleData.templateName

    if (err) {
      return void cb(err)
    }

    cb(err, resolvedModule)
  })
}
