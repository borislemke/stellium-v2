import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { NextFunction, Request, Response } from 'express'
import { Globals } from '../../globals'
import * as raven from 'raven'
import { extractStelliumDomain } from '../../utils/extract_stellium_domain'

const redisPageCacheClient = createClient()

export const websiteCacheMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const hostname = extractStelliumDomain(req)

  if (Globals.SkipCache) {
    return next()
  }

  const urlHash = stringToCacheKey(RedisTable.PageCache, hostname, req.url)

  redisPageCacheClient.get(urlHash, (err, cachedPage) => {
    if (err) {
      raven.captureException(err)
    }

    if (cachedPage) {
      return void res.send(cachedPage)
    }

    next()
  })
}
