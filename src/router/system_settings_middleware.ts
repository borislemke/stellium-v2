import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'
import { stringToCacheKey } from '../helpers/url_cache'
import { SystemSettingsModel } from '../models/models/system_settings'

const redisSettingsClient = createClient({db: RedisTable.SystemSettings})

export const systemSettingsMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  const cacheKey = stringToCacheKey(req.hostname)

  redisSettingsClient.get(cacheKey, (err, settings: string) => {
    if (err) {
      /**
       * TODO(error): Error handling
       * @date - 7/7/17
       * @time - 3:22 PM
       */
    }
    if (settings) {
      req.app.locals.db_settings = JSON.parse(settings)
      return next()
    }
    SystemSettingsModel
      .find({})
      .select('title key value type')
      .lean()
      .exec((err, _settings) => {
      redisSettingsClient.set(cacheKey, JSON.stringify(_settings))
        req.app.locals.db_settings = _settings
        next()
    })
  })
}
