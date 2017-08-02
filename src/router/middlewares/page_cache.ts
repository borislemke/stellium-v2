import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { NextFunction, Request, Response } from 'express'
import { Globals } from '../../globals'
import { RaygunClient } from '../../utils/raygun'

const redisPageCacheClient = createClient({db: RedisTable.PageCache})

export const websiteCacheMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  if (Globals.Development) {
    return void next()
  }

  const urlHash = stringToCacheKey(req.hostname, req.url)

  redisPageCacheClient.get(urlHash, (err, cachedPage) => {
    if (err) {
      RaygunClient.send(err)
    }
    if (cachedPage) {
      return void res.send(cachedPage)
    }
    next()
  })
}
