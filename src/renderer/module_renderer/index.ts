import { resolve } from 'path'
import { templateRenderer } from './template_renderer'
import { Globals } from '../../globals'
import { stylesheetCompiler } from './stylesheet_compiler'
import { RequestKeys } from '../../helpers/request_keys'

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

export const ModuleRenderer = (pageData: any, requestObject: any) => (moduleData: any, cb: (err: any, resolvedModule?: any) => void): void => {

  moduleData.templateName = moduleData.template

  moduleData.template = resolve(Globals.TemplatesPath, requestObject[RequestKeys.CurrentTemplate], 'modules', moduleData.template)

  moduleData.moduleId = 'xyz-' + getModuleId(moduleData.templateName)

  stylesheetCompiler(moduleData, (err, css) => {

    if (err) {
      return void cb(err)
    }

    templateRenderer(pageData, moduleData)((err, html) => {

      if (err) {
        return void cb(err)
      }

      const resolvedModule = {
        template: html,
        styles: css
      }

      cb(err, resolvedModule)
    })
  })
}
