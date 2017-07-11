import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { SystemLanguageModel } from '../../models/models/system_language'
import { RequestKeys } from '../../helpers/request_keys'
import { errorPageRenderer } from '../../renderer/error_handler'
import { WriteStub } from '../../utils/write_stub'

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
        if (err) {
          console.log('err\n', err)
          return void errorPageRenderer(req, res)
        }
        if (!_langs) {
          console.log('No languages found', _langs)
          return void errorPageRenderer(req, res)
        }
        WriteStub(_langs, 'system_languages')
        redisLanguageClient.set(cacheKey, JSON.stringify(_langs))
        req.app.locals[RequestKeys.DBLanguages] = _langs
        next()
      })
  })
}
