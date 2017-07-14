import { resolve } from 'path'
import * as async from 'async'
import { Request } from 'express'
import { templateRenderer } from './template_renderer'
import { stylesheetCompiler } from './stylesheet_compiler'
import { RequestKeys } from '../../helpers/request_keys'
import { scriptsCompiler } from './scripts_compiler'

let _sectionId = 0

const sectionIdCache = {}

const getSectionId = (templateName: string): string => {

  if (sectionIdCache[templateName]) {
    return sectionIdCache[templateName]
  } else {
    sectionIdCache[templateName] = ++_sectionId
    return sectionIdCache[templateName]
  }
}

export const SectionRenderer = (renderData: any, req: Request) => (sectionData: any, cb: (err: any, resolvedSection?: any) => void): void => {

  sectionData.templateName = sectionData.template

  sectionData.template = resolve(req.app.locals[RequestKeys.CurrentTemplatePath], 'sections', sectionData.template)

  sectionData.sectionId = getSectionId(sectionData.templateName)

  async.series({
    styles: stylesheetCompiler(sectionData),
    template: templateRenderer(renderData, sectionData, req),
    scripts: scriptsCompiler(sectionData)
  }, (err, resolvedSection) => {

    resolvedSection.templateName = sectionData.templateName

    if (err) {
      return void cb(err)
    }

    cb(err, resolvedSection)
  })
}
