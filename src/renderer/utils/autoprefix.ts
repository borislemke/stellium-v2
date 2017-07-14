import * as autoPrefix from 'autoprefixer'
import * as postCss from 'postcss'

export const autoPrefixCss = (css: string, cb: (err: any, compiledCss?: string) => void) => {

  postCss([autoPrefix])
    .process(css)
    .then(result => {
      cb(result.warnings(), result.css)
    })
}
