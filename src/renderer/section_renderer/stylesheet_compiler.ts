import { stat } from 'fs'
import { render } from 'node-sass'
import { parse, stringify } from 'css'
import { Globals } from '../../globals'
import { assignHoistId, HoistType } from '../utils/hoist_id'
import { RaygunClient } from '../../utils/raygun'

const cachedStyles = {}

export const stylesheetCompiler = (sectionData: any) => (cb: (err: any, compiledCss: any) => void): void => {

  // Compiled stylesheet for this section has been previously processed and cached
  if (cachedStyles[sectionData.templateName] && Globals.Production) {
    return void cb(null, cachedStyles[sectionData.templateName])
  }

  const scssFilePath = sectionData.template + '/section.scss'

  stat(scssFilePath, err => {

    if (err) {
      if (err.code === 'ENOENT') {
        // Ignore error if the stylesheet file does not exist
        return void cb(null, '')
      }
      RaygunClient.send(err)
      return void cb(err, '')
    }

    render({file: scssFilePath}, (err, css) => {

      if (err) {
        console.log('render err\n', err)
        return void cb(err, '')
      }

      let astCss

      try {
        // Parse AST CSS object into an Object of strings and array of strings
        astCss = parse(css.css.toString('UTF-8'))

      } catch (error) {
        RaygunClient.send(err)

        return void cb(null, '')
      }

      astCss.stylesheet.rules.forEach(_cssRule => {

        if (_cssRule.type === 'rule') {

          _cssRule['selectors'] = _cssRule['selectors'].map(_rule => {

            // Replace host selector with generated section ID
            // ':host div' -> '[data-section-host-XYZ-1] div'
            _rule = _rule.replace(':host', assignHoistId(HoistType.Host, sectionData.sectionId))

            /**
             * TODO(opt): Optimise : and :: compilation
             * @date - 28-07-2017
             * @time - 21:09
             */
            if (_rule.includes('::')) {

              // :host div:first-child -> [':host div', 'first-child']
              const pseudoDelimited = _rule.split('::')

              // [':host div', 'first-child'] -> ':host div[data-section-content-XYZ-1]:first-child'
              return pseudoDelimited.join(assignHoistId(HoistType.Content, sectionData.sectionId) + '::')
            }

            // Pseudo selectors
            // e.g: :host div:first-child
            if (_rule.includes(':') && !_rule.includes('::')) {

              // :host div:first-child -> [':host div', 'first-child']
              const pseudoDelimited = _rule.split(':')

              // [':host div', 'first-child'] -> ':host div[data-section-content-XYZ-1]:first-child'
              return pseudoDelimited.join(assignHoistId(HoistType.Content, sectionData.sectionId) + ':')
            }

            // Non-Pseudo: '[data-section-host-XYZ-1] div[data-section-content-XYZ-1]'
            // Pseudo: '[data-section-host-XYZ-1] div[data-section-content-XYZ-1]:first-child[data-section-content-XYZ-1]'
            return _rule + assignHoistId(HoistType.Content, sectionData.sectionId)
            // return `${_rule}[data-section-content-${sectionData.sectionId}]`
          })

        } else {

          console.log('_cssRule\n', _cssRule)
        }
      })

      const stringifiedCss = stringify(astCss)

      // Save compiled stylesheet into cache for re-use
      cachedStyles[sectionData.templateName] = stringifiedCss

      cb(null, stringifiedCss)
    })
  })
}
