import * as url from 'url'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { NextFunction, Request, Response } from 'express'
import { Globals } from '../../globals'
import { extractStelliumDomain } from '../../utils/extract_stellium_domain'
import { ArgusClient } from '../../utils/argus'

const redisPageCacheClient = createClient()

export const websiteCacheMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const hostname = extractStelliumDomain(req)

  if (Globals.SkipCache) {
    return next()
  }

  const urlHash = stringToCacheKey(RedisTable.PageCache, hostname, url.parse(req.url).pathname)

  redisPageCacheClient.get(urlHash, (err, cachedPage) => {
    if (err) {
      ArgusClient.send(err)
    }

    if (cachedPage) {
      return void res.send(cachedPage)
    }

    next()
  })
}
