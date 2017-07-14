import { resolve } from 'path'
import { renderFile } from 'ejs'
import { load } from 'cheerio'
import { EscapeHTML } from '../../utils/encode_html'
import { RemoveSystemPath } from '../../utils/remove_system_path'
import { Globals } from '../../globals'
import { Request } from 'express'
import { TemplateFunctions } from './template_functions'
import { RequestKeys } from '../../helpers/request_keys'
import { ComponentRenderer } from '../component_renderer/index'

/**
 * Section renderer resolves template, data, styling and logic bindings
 * @param renderData
 * @param sectionData
 * @param req
 */
export const templateRenderer = (renderData: any, sectionData: any, req: Request) => (cb: (err: any, rendererSectionTemplate: any) => void): void => {

  const sectionBasePath = resolve(sectionData.template, 'section.')

  const scopedRenderData = {
    ComponentRenderer: ComponentRenderer(req.app.locals[RequestKeys.CurrentTemplatePath], renderData),
    TemplateFunctions: new TemplateFunctions(req),
    ...renderData,
    section: sectionData
  }

  const renderOptions = {
    cache: Globals.Production
  }

  renderFile(sectionBasePath + 'ejs', scopedRenderData, renderOptions, (err, html) => {

    if (err) {
      if (err['code'] === 'ENOENT') {
        console.log('Template file for this section does not exists')
      }
      /**
       * TODO(error): Error handling
       * @date - 7/11/17
       * @time - 4:43 PM
       */
      const malformed = {
        order: sectionData.order,
        templateName: sectionData.templateName,
        error: err
      }

      const errorStart = `
      <section data-mt-template="${sectionData.templateName}"
data-mt-error="Section data malformed" style="padding: 1.5rem;">
      `

      const errorTemplate = `
    <div style="width: 80vw; margin: auto; max-width: 720px; padding: 1.5rem; border: 1px solid rgba(10, 20, 30, .1)">
        <h1 style="color: #EF5350; margin: 0; margin-bottom: .5rem; font-weight: 400; font-size: 1.2rem;">
            Section Data Malformed: ${sectionData.templateName}
        </h1>
        <pre style="overflow: scroll; margin: 0; background-color: rgba(10, 20, 30, 0.1); padding: 1rem; color: rgba(10, 20, 30, 0.64);">
        ${EscapeHTML(RemoveSystemPath(malformed.error.message))}
        </pre>
    </div>
`
      const errorEnd = `</section>`
      // Gracefully ignore malformed section but notify user of issue
      return void cb(null, errorStart + (Globals.Development ? errorTemplate : '') + errorEnd)
    }

    const $ = load(html, {xmlMode: true} as any)

    $('*').attr('data-section-content-' + sectionData.sectionId, '')

    const wrappedSection = `
<!-- template-start: ${sectionData.templateName} -->
<section data-mt-template="${sectionData.templateName}"
         data-section-host-${sectionData.sectionId} data-section-content-${sectionData.sectionId}>
    ${$.html()}
</section>
<!-- template-end: ${sectionData.templateName} -->
`

    cb(null, wrappedSection)
  })
}
