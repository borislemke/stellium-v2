import { resolve } from 'path'
import { renderFile } from 'ejs'
import { load } from 'cheerio'
import { EscapeHTML } from '../../utils/encode_html'
import { RemoveSystemPath } from '../../utils/remove_system_path'
import { Globals } from '../../globals'
import { Request } from 'express'
import { TemplateFunctions } from './template_functions'

/**
 * Module renderer resolves template, data, styling and logic bindings
 * @param pageData
 * @param moduleData
 * @param req
 */
export const templateRenderer = (pageData: any, moduleData: any, req: Request) => (cb: (err: any, module?: any) => void): void => {

  const moduleBasePath = resolve(moduleData.template, 'module.')

  const renderData = {
    TemplateFunctions: new TemplateFunctions(req),
    ...pageData,
    module: moduleData
  }

  const renderOptions = {
    cache: Globals.Production
  }

  renderFile(moduleBasePath + 'ejs', renderData, renderOptions, (err, html) => {

    if (err) {
      if (err['code'] === 'ENOENT') {
        console.log('Template file for this module does not exists')
      }
      /**
       * TODO(error): Error handling
       * @date - 7/11/17
       * @time - 4:43 PM
       */
      const malformed = {
        order: moduleData.order,
        templateName: moduleData.templateName,
        error: err
      }

      const errorStart = `
      <section data-mt-template="${moduleData.templateName}"
data-mt-error="Module data malformed" style="padding: 1.5rem;">
      `

      const errorTemplate = `
    <div style="width: 80vw; margin: auto; max-width: 720px; padding: 1.5rem; border: 1px solid rgba(10, 20, 30, .1)">
        <h1 style="color: #EF5350; margin: 0; margin-bottom: .5rem; font-weight: 400; font-size: 1.2rem;">
            Module Data Malformed: ${moduleData.templateName}
        </h1>
        <pre style="overflow: scroll; margin: 0; background-color: rgba(10, 20, 30, 0.1); padding: 1rem; color: rgba(10, 20, 30, 0.64);">
        ${EscapeHTML(RemoveSystemPath(malformed.error.message))}
        </pre>
    </div>
`
      const errorEnd = `</section>`
      // Gracefully ignore malformed module but notify user of issue
      return void cb(null, errorStart + (Globals.Development ? errorTemplate : '') + errorEnd)
    }

    const $ = load(html, {xmlMode: true} as any)

    $('*').attr('data-content-' + moduleData.moduleId, '')

    const wrappedModule = `
<!-- template-start: ${moduleData.templateName} -->
<section data-mt-template="${moduleData.templateName}"
         data-host-${moduleData.moduleId} data-content-${moduleData.moduleId}>
    ${$.html()}
</section>
<!-- template-end: ${moduleData.templateName} -->
`

    cb(null, wrappedModule)
  })
}
