import * as glob from 'glob'
import { parse, stringify } from 'css'
import { resolve } from 'path'
import { map } from 'async'
import { render } from 'node-sass'

const compileStyleFile = (filePath: string, cb: (err: any, compileStyles: string) => void): void => {

  const [withoutExtension] = filePath.split('.')

  const nameChunk = withoutExtension.split('/')

  const componentName = nameChunk[nameChunk.length - 2]

  // filePath
  render({file: filePath}, (err, css) => {

    if (err) {
      return void cb(null, '')
    }

    const astCss = parse(css.css.toString('UTF-8'))

    astCss.stylesheet.rules.forEach(_cssRule => {

      _cssRule['selectors'] = _cssRule['selectors'].map(_rule => {

        const componentContent = `[data-component-content-${componentName}]`

        const componentHost = `[data-component-host-${componentName}]`

        _rule = _rule.replace(':host', componentHost)

        if (_rule.includes(':')) {

          const pseudoDelimited = _rule.split(':')

          return pseudoDelimited.join(componentContent + ':')
        }
        return _rule + componentContent
      })
    })

    const stringifiedCss = stringify(astCss)

    cb(null, stringifiedCss)
  })
}

export const ComponentsStylesCompiler = (templatePath: string, cb: (err: any, componentStyles?: string) => void): void => {

  const componentStylesPath = resolve(templatePath, 'components') + '/**/*.scss'

  glob(componentStylesPath, (err, styleFiles) => {

    if (err) {
      /**
       * TODO(error): Error handling, glob failed o scan style files
       * @date - 7/14/17
       * @time - 3:15 PM
       */
      return void cb(err)
    }

    map(styleFiles, compileStyleFile, (err, compiledStyles) => {

      cb(err, compiledStyles && compiledStyles.join('\n'))
    })
  })
}
