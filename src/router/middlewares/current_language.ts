import { NextFunction, Request, Response } from 'express'
import { RequestKeys } from '../../helpers/request_keys'
import { RaygunClient } from '../../utils/raygun'

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

  const languages = req.app.locals[RequestKeys.DBLanguages]

  let defaultLanguage = languages.find(_lang => _lang.default)

  if (!defaultLanguage) {
    RaygunClient.send(new Error('No default language found'))
    defaultLanguage = languages[0]
  }

  const [hasCode, languageCode] = hasLanguageCode(req.url)

  if (hasCode) {

    const inDb = languages.find(_lang => _lang.code === languageCode)

    // The URL has a language code that matches the languages stored in the database
    if (inDb) {
      req.app.locals[RequestKeys.CurrentLanguage] = inDb.code
      return void next()
    } else {
      // No matching language code found, assign the default language to it
      req.url = ('/' + defaultLanguage.code + req.url).replace(/\/+$/g, '')

      req.app.locals[RequestKeys.CurrentLanguage] = defaultLanguage.code

      return void next()
    }

  } else {

    req.app.locals[RequestKeys.CurrentLanguage] = defaultLanguage.code

    req.url = ('/' + defaultLanguage.code + req.url).replace(/\/+$/g, '')

    next()
  }
}
