import { NextFunction, Request, Response } from 'express'
import { WebsitePageModel } from '../../models/models/website_page'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'

const redisPagesClient = createClient({db: RedisTable.WebsitePages})

export const websitePagesFeedMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  const cacheKey = stringToCacheKey(req.hostname)

  redisPagesClient.get(cacheKey, (err, pages) => {
    if (err) {
      /**
       * TODO(error): Error handling
       * @date - 7/7/17
       * @time - 3:52 PM
       */
    }
    if (pages) {
      req.app.locals.db_pages = JSON.parse(pages)
      return void next()
    }

    WebsitePageModel
      .find({})
      .lean()
      .select('title meta url status')
      .exec((err, pages) => {
        if (err) {
          /**
           * TODO(error): Error handling
           * @date - 7/7/17
           * @time - 3:50 PM
           */
          return void res.sendStatus(500)
        }
        req.app.locals.db_pages = pages
        next()
      })
  })
}
