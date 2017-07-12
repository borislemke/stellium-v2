import { stat } from 'fs'
import { parse, stringify } from 'css'
import { render } from 'node-sass'

const cachedStyles = {}

export const stylesheetCompiler = (moduleData: any) => (cb: (err: any, compiledCss?: any) => void): void => {

  if (cachedStyles[moduleData.templateName]) {
    return void cb(null, cachedStyles[moduleData.templateName])
  }

  const scssFilePath = moduleData.template + '/module.scss'

  stat(scssFilePath, err => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Ignore Style sheet if it does not exist
        return void cb(null)
      }
      return void cb(err)
    }

    render({file: scssFilePath}, (err, css) => {

      if (err) {
        console.log('err\n', err)
        return void cb(err)
      }

      const astCss = parse(css.css.toString('UTF-8'))

      astCss.stylesheet.rules.forEach(_cssRule => {

        _cssRule['selectors'] = _cssRule['selectors'].map(_rule => {

          _rule = _rule.replace(':host', `[data-host-${moduleData.moduleId}]`)

          if (_rule.includes(':')) {

            const pseudoDelimited = _rule.split(':')

            return pseudoDelimited.join(`[data-content-${moduleData.moduleId}]:`)
          }
          return `${_rule}[data-content-${moduleData.moduleId}]`
        })
      })

      const stringifiedCss = stringify(astCss)

      cachedStyles[moduleData.templateName] = stringifiedCss

      cb(null, stringifiedCss)
    })
  })
}
