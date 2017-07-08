import { NextFunction, Request, Response } from 'express'

const hasLanguageCode = (url: string): [boolean, string] => {
  const stripped = url.replace(/^\/+|\/+$/g, '')
  let chunk
  if (stripped.includes('/')) {
    chunk = stripped.split('/')[0]
  } else {
    chunk = stripped
  }
  return [chunk.length === 2, chunk]
}

export const currentLanguageMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const languages = req.app.locals.db_languages

  let defaultLanguage = languages.find(_lang => _lang.default)

  if (!defaultLanguage) {
    console.log('No defaultLanguage')
    /**
     * TODO(error): Error handling, no default language set
     * TODO(error): Add to health check!
     * @date - 7/7/17
     * @time - 7:02 PM
     */
    defaultLanguage = languages[0]
  }

  const [hasCode, languageCode] = hasLanguageCode(req.url)

  if (hasCode) {

    const inDb = languages.find(_lang => _lang.code === languageCode)

    // The URL has a language code that matches the languages stored in the database
    if (inDb) {
      req.app.locals.current_language = inDb.code
      return void next()
    } else {
      // No matching language code found, assign the default language to it
      req.url = ('/' + defaultLanguage.code + req.url).replace(/\/+$/g, '')

      req.app.locals.current_language = defaultLanguage.code

      return void next()
    }

  } else {

    req.app.locals.current_language = defaultLanguage.code

    req.url = ('/' + defaultLanguage.code + req.url).replace(/\/+$/g, '')

    next()
  }
}
