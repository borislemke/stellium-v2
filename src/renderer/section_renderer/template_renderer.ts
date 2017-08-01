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
import { assignHoistId, HoistType } from '../utils/hoist_id'

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

      const malformed = {
        order: sectionData.order,
        templateName: sectionData.templateName,
        error: err
      }

      const errorStart = `
      <section data-mt-template="${sectionData.templateName}"
data-mt-error="Section data malformed" style="padding: 1.5rem;">
      `

      const replaceErrorArrow = (text: string) => {

        return text.split('\n').map((_text, index, _split) => {
          let modified = _text

          if (_text.includes('&gt;&gt; ')) {
            modified = `<span style="color: #EF5350;">${_text.replace('&gt;&gt;', '  ')}</span>`
          }

          if (index + 1 === _split.length) {
            const [target, ...whatever] = modified.split(' ')

            modified = `<span style="color: #EF5350; font-weight: 700;">${target}</span> ${whatever.join(' ')}`
          }

          return modified
        }).join('\n')
      }

      const errorTemplate = `
    <div style="width: 80vw; margin: auto; max-width: 720px; padding: 1.5rem; border: 1px solid rgba(10, 20, 30, .1)">
        <h1 style="color: #EF5350; margin: 0; margin-bottom: 1rem; font-weight: 400; font-size: 1.2rem;">
            Section Data Malformed: ${sectionData.templateName}
        </h1>
        <pre style="font-family: 'Fira Code', monospace; line-height:1.4;overflow: scroll; margin: 0; background-color: rgba(10, 20, 30, 0.1); padding: 1rem; color: rgba(10, 20, 30, 0.64);">${replaceErrorArrow(EscapeHTML(RemoveSystemPath(malformed.error.message)))}</pre>
    </div>
`
      const errorEnd = `</section>`
      // Gracefully ignore malformed section but notify user of issue
      return void cb(null, errorStart + (Globals.Development ? errorTemplate : '') + errorEnd)
    }

    const $ = load(html, {xmlMode: true} as any)

    $('*').attr(assignHoistId(HoistType.Content, sectionData.sectionId, false), '')

    const wrappedSection = `
<!-- template-start: ${sectionData.templateName} -->
<section data-mt-template="${sectionData.templateName}"
         ${assignHoistId(HoistType.Host, sectionData.sectionId, false)}
         ${assignHoistId(HoistType.Content, sectionData.sectionId, false)}>
    ${$.html()}
</section>
<!-- template-end: ${sectionData.templateName} -->
`

    cb(null, wrappedSection)
  })
}
