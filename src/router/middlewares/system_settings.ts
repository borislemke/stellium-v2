import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { SystemSettingsModel } from '../../models/models/system_settings'
import { ReqKeys } from '../../helpers/request_keys'
import { Globals } from '../../globals'
import * as raven from 'raven'
import { extractStelliumDomain } from '../../utils/extract_stellium_domain'

const redisClient = createClient()

export const systemSettingsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const hostname = extractStelliumDomain(req)

  const cacheKey = stringToCacheKey(RedisTable.SystemSettings, hostname)

  redisClient.get(cacheKey, (err, settings: string) => {
    if (err) {
      raven.captureException(err)
    }

    if (settings) {
      req.app.locals[ReqKeys.DBSettings] = JSON.parse(settings)

      return next()
    }

    SystemSettingsModel
      .find({})
      .select('title key value type')
      .lean()
      .exec((err, _settings: any[]) => {
        if (err) {
          return next(err)
        }

        if (!_settings || !_settings.length) {
          if (Globals.Development) {
            delete require.cache[Globals.SeederPath + '/system_settings.json']

            _settings = require(Globals.SeederPath + '/system_settings.json')

          } else {
            raven.captureException(new Error('No system settings found'))
          }
        }

        redisClient.set(cacheKey, JSON.stringify(_settings))

        req.app.locals[ReqKeys.DBSettings] = _settings

        next()
      })
  })
}
