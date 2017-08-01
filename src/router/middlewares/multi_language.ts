import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { SystemLanguageModel } from '../../models/models/system_language'
import { RequestKeys } from '../../helpers/request_keys'
import { errorPageRenderer } from '../../renderer/error_handler'
import { WriteStub } from '../../utils/write_stub'
import { Globals } from '../../globals'
import { RaygunClient } from '../../utils/raygun'

const redisLanguageClient = createClient({db: RedisTable.SystemLanguage})

export const multiLanguageMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const cacheKey = stringToCacheKey(req.hostname)

  redisLanguageClient.get(cacheKey, (err, langs) => {
    if (err) {
      RaygunClient.send(err)
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
          console.log('err\n', err)
          RaygunClient.send(err)
          return void errorPageRenderer(req, res)
        }

        if (!_languages || !(_languages as any[]).length) {

          if (Globals.Production) {
            RaygunClient.send(new Error('No system languages found'))
            return void res.sendStatus(500)
          }

          delete require.cache[Globals.SeederPath + '/system_languages.json']
          _languages = require(Globals.SeederPath + '/system_languages.json')
        }

        WriteStub(_languages, 'system_languages')
        redisLanguageClient.set(cacheKey, JSON.stringify(_languages))
        req.app.locals[RequestKeys.DBLanguages] = _languages
        next()
      })
  })
}
