import { readFileSync } from 'fs'
import { resolve } from 'path'
import { load } from 'cheerio'
import { render } from 'ejs'

const componentTemplateCache = {}

export const ComponentRenderer = (templatePath: string, renderData: any) => (componentName: string, componentData: any): string => {

  const componentPath = resolve(templatePath, 'components', componentName, 'component.ejs')

  let renderedComponent = ''

  try {

    const componentString = componentTemplateCache[componentName] || readFileSync(componentPath, 'utf8')

    // Cache string read from template file
    if (!componentTemplateCache[componentName]) {
      componentTemplateCache[componentName] = componentString
    }

    renderedComponent = render(componentString, {
      ...renderData,
      Component: componentData
    })

    const $ = load(renderedComponent, {xmlMode: true})

    $('*').first().attr('data-mtchost-' + componentName, '')

    $('*').attr('data-mtccont-' + componentName, '')

    renderedComponent = $.html()

  } catch (e) {

    renderedComponent = `
<div data-component-error="Component renderer error"
     data-component="${componentName}">
     <!-- ${e.message} -->
</div>
`
  }

  // componentMap[componentName] = componentId

  return renderedComponent
}
