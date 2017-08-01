import * as minifier from 'html-minifier'

const minify = minifier.minify

/**
 * Global template minifier
 * @param html
 * @param aggressive
 * @returns {string}
 * @constructor
 */
export const minifyTemplate = (html: string, aggressive: boolean = false): string => {

  // Minify rendered html to be saved in cache
  return minify(html, {
    // Collapse whitespace
    collapseWhitespace: true,
    // Collapse line breaks to 1 line break minimum, never remove it entirely
    preserveLineBreaks: !aggressive,
    // Remove comments
    removeComments: aggressive,
    // Minify inline JavaScript
    minifyJS: aggressive,
    // Minify inline css
    minifyCSS: aggressive
  })
}
