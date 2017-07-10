import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'
import { stringToCacheKey } from '../helpers/url_cache'
import { WebsitePageModel } from '../models/models/website_page'
import { RequestKeys } from '../helpers/request_keys'

const redisPagesClient = createClient({db: RedisTable.WebsitePages})

export const pageLoaderMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  // home
  const pageUrl = req.url

  // stellium.io-home -> 103460287648712398723412345123
  const cacheKey = stringToCacheKey(req.hostname, '_', pageUrl)

  redisPagesClient.get(cacheKey, (err, cachedPage) => {
    if (err) {
      /**
       * TODO(error): Error handling
       * @date - 7/9/17
       * @time - 12:26 AM
       */
    }
    if (cachedPage) {
      try {
        req.app.locals[RequestKeys.CurrentPageObject] = JSON.parse(cachedPage)
        return void next()
      } catch (e) {
        // Unable to parse cached page
      }
    }
    WebsitePageModel
      .findOne({[`url.${req.app.locals[RequestKeys.CurrentLanguage]}`]: pageUrl})
      .lean()
      .exec((err, pageObject) => {
        if (err) {
          /**
           * TODO(error): Error handling
           * @date - 7/9/17
           * @time - 12:29 AM
           */
          return res.sendStatus(500)
        }
        if (!pageObject) {
          return void res.sendStatus(404)
        }
        // save pageObject into request
        req.app.locals[RequestKeys.CurrentPageObject] = pageObject
        redisPagesClient.set(cacheKey, JSON.stringify(pageObject), err => {
          if (err) {
            /**
             * TODO(error): Error handling
             * @date - 7/9/17
             * @time - 12:30 AM
             */
          }
          return void next()
        })
      })
  })
}
