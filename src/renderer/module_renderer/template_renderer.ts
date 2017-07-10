import { resolve } from 'path'
import { renderFile } from 'ejs'
import * as cheerio from 'cheerio'

/**
 * Module renderer resolves template, data, styling and logic bindings
 * @param pageData
 * @param moduleData
 */
export const templateRenderer = (pageData: any, moduleData: any) => (cb: (err: any, module?: any) => void): void => {

  const moduleBasePath = resolve(moduleData.template, 'module.')

  const renderData = {
    ...pageData,
    module: moduleData
  }

  renderFile(moduleBasePath + 'ejs', renderData, (err, html) => {

    if (err) {
      if (err['code'] === 'ENOENT') {
        console.log('Template file for this module does not exists')
      }
      return void cb(err)
    }

    const $ = cheerio.load(html, {xmlMode: true} as any)

    $('*').attr('data-content-' + moduleData.moduleId, '')

    const wrappedModule = `
<!-- template-start: ${moduleData.templateName} -->
<section data-mt-template="${moduleData.templateName}"
         data-host-${moduleData.moduleId}>
    ${$.html()}
</section>
<!-- template-end: ${moduleData.templateName} -->
`

    cb(null, wrappedModule)
  })
}
