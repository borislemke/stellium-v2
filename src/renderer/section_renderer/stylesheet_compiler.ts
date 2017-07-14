import { stat } from 'fs'
import { parse, stringify } from 'css'
import { render } from 'node-sass'
import { Globals } from '../../globals'

const cachedStyles = {}

export const stylesheetCompiler = (sectionData: any) => (cb: (err: any, compiledCss: any) => void): void => {

  if (cachedStyles[sectionData.templateName] && Globals.Production) {
    return void cb(null, cachedStyles[sectionData.templateName])
  }

  const scssFilePath = sectionData.template + '/section.scss'

  stat(scssFilePath, err => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Ignore Style sheet if it does not exist
        return void cb(null, '')
      }
      return void cb(err, '')
    }

    render({file: scssFilePath}, (err, css) => {

      if (err) {
        console.log('err\n', err)
        return void cb(err, '')
      }

      const astCss = parse(css.css.toString('UTF-8'))

      astCss.stylesheet.rules.forEach(_cssRule => {

        _cssRule['selectors'] = _cssRule['selectors'].map(_rule => {

          _rule = _rule.replace(':host', `[data-section-host-${sectionData.sectionId}]`)

          if (_rule.includes(':')) {

            const pseudoDelimited = _rule.split(':')

            return pseudoDelimited.join(`[data-section-content-${sectionData.sectionId}]:`)
          }
          return `${_rule}[data-section-content-${sectionData.sectionId}]`
        })
      })

      const stringifiedCss = stringify(astCss)

      cachedStyles[sectionData.templateName] = stringifiedCss

      cb(null, stringifiedCss)
    })
  })
}
