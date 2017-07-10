import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'
import { stringToCacheKey } from '../helpers/url_cache'
import { SystemLanguageModel } from '../models/models/system_language'
import { RequestKeys } from '../helpers/request_keys'

const redisLanguageClient = createClient({db: RedisTable.SystemLanguage})

export const multiLanguageMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const cacheKey = stringToCacheKey(req.hostname)

  redisLanguageClient.get(cacheKey, (err, langs) => {
    if (err) {
      /**
       * TODO(error): Error handling
       * @date - 7/7/17
       * @time - 3:26 PM
       */
    }
    if (langs) {
      req.app.locals[RequestKeys.DBLanguages] = JSON.parse(langs)
      return void next()
    }

    SystemLanguageModel
      .find({})
      .select('title code status default')
      .lean()
      .exec((err, _langs) => {
        redisLanguageClient.set(cacheKey, JSON.stringify(_langs))
        req.app.locals[RequestKeys.DBLanguages] = _langs
        next()
      })
  })
}
