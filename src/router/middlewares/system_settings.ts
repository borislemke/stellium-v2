import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { SystemSettingsModel } from '../../models/models/system_settings'
import { RequestKeys } from '../../helpers/request_keys'
import { WriteStub } from '../../utils/write_stub'
import { RaygunClient } from '../../utils/raygun'
import { Globals } from '../../globals'

const redisSettingsClient = createClient({db: RedisTable.SystemSettings})

export const systemSettingsMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  const cacheKey = stringToCacheKey(req.hostname)

  redisSettingsClient.get(cacheKey, (err, settings: string) => {
    if (err) {
      RaygunClient.send(err)
    }
    if (settings) {
      req.app.locals[RequestKeys.DBSettings] = JSON.parse(settings)
      return next()
    }
    SystemSettingsModel
      .find({})
      .select('title key value type')
      .lean()
      .exec((err, _settings: any[]) => {
        if (err) {
          RaygunClient.send(err)
          return void res.sendStatus(500)
        }
        WriteStub(_settings, 'system_settings')

        if (!_settings || !_settings.length) {
          if (Globals.Development) {
            delete require.cache[Globals.SeederPath + '/system_settings.json']
            _settings = require(Globals.SeederPath + '/system_settings.json')
          } else {
            RaygunClient.send(new Error('No system settings found'))
          }
        }

        redisSettingsClient.set(cacheKey, JSON.stringify(_settings))
        req.app.locals[RequestKeys.DBSettings] = _settings
        next()
      })
  })
}
