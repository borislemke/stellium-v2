import { readFileSync } from 'fs'
import { resolve } from 'path'
import { load } from 'cheerio'
import { render } from 'ejs'

const componentMap = {}

let _componentId = 0

export const ComponentRenderer = (templatePath: string, renderData: any) => (componentName: string, componentData: any): string => {

  // const componentId = componentMap[componentName] ? componentMap[componentName] : 'data-mt-component-' + ++_componentId

  const componentPath = resolve(templatePath, 'components', componentName, 'component.ejs')

  let renderedComponent = ''

  try {

    const componentString = readFileSync(componentPath, 'utf8')

    renderedComponent = render(componentString, {
      ...renderData,
      Component: componentData
    })

    const $ = load(renderedComponent, {xmlMode: true})

    $('*').first().attr('data-component-host-' + componentName, '')

    $('*').attr('data-component-content-' + componentName, '')

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
