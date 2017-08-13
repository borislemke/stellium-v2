import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { SystemLanguageModel } from '../../models/models/system_language'
import { RequestKeys } from '../../helpers/request_keys'
import { errorPageRenderer } from '../../renderer/error_handler'
import { Globals } from '../../globals'
import * as raven from 'raven'
import { extractStelliumDomain } from '../../utils/extract_stellium_domain'

const redisClient = createClient()

export const multiLanguageMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const hostname = extractStelliumDomain(req)

  const cacheKey = stringToCacheKey(RedisTable.SystemLanguages, hostname)

  redisClient.get(cacheKey, (err, langs) => {
    if (err) {
      raven.captureException(err)
    }

    if (langs) {
      req.app.locals[RequestKeys.DBLanguages] = JSON.parse(langs)

      return void next()
    }

    SystemLanguageModel
    // Only query languages that are enabled
    // this is determined by the status property[boolean]
      .find({status: true})
      .select('title code status default')
      .lean()
      .exec((err, _languages) => {
        if (err) {
          raven.captureException(err)

          return void errorPageRenderer(req, res)
        }

        if (!_languages || !(_languages as any[]).length) {
          if (Globals.Production) {
            return next(new Error('No system languages found'))
          }

          delete require.cache[Globals.SeederPath + '/system_languages.json']

          _languages = require(Globals.SeederPath + '/system_languages.json')
        }

        redisClient.set(cacheKey, JSON.stringify(_languages))

        req.app.locals[RequestKeys.DBLanguages] = _languages

        next()
      })
  })
}
