import { stat } from 'fs'
import { parse, stringify } from 'css'
import * as nodeSass from 'node-sass'

export const stylesheetCompiler = (moduleData: any, cb: (err: any, compiledCss?: any) => void): void => {

  const scssFilePath = moduleData.template + '/module.scss'

  stat(scssFilePath, err => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('err\n', err)
        return void cb(null)
      }
      return void cb(err)
    }

    nodeSass.render({file: scssFilePath}, (err, css) => {

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

      cb(err, stringify(astCss))
    })
  })
}
