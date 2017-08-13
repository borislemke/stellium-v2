import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { RequestKeys } from '../../helpers/request_keys'
import { MediaFileModel } from '../../models/models/media_file'
import * as raven from 'raven'
import { extractStelliumDomain } from '../../utils/extract_stellium_domain'

const redisClient = createClient()

export const mediaFilesFeedMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const hostname = extractStelliumDomain(req)

  const cacheKey = stringToCacheKey(RedisTable.MediaFiles, hostname)

  redisClient.get(cacheKey, (err, cachedMedia) => {
    if (err) {
      raven.captureException(err)
    }

    if (cachedMedia) {
      req.app.locals[RequestKeys.DBMediaFiles] = JSON.parse(cachedMedia)

      return void next()
    }

    MediaFileModel
      .find({})
      .select('title url meta')
      .lean()
      .exec((err, media) => {
        if (err) {
          return next(err)
        }

        req.app.locals[RequestKeys.DBMediaFiles] = media

        next()
      })
  })
}
