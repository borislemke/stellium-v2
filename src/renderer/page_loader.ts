import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'
import { stringToCacheKey } from '../helpers/url_cache'
import { WebsitePageModel } from '../models/models/website_page'
import { RequestKeys } from '../helpers/request_keys'
import { Globals } from '../globals'
import * as Raven from 'raven'
import { HTTPStatusCode } from '../utils/response_code'
import { extractStelliumDomain } from '../utils/extract_stellium_domain'

const redisClient = createClient()

export const pageLoaderMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const hostname = extractStelliumDomain(req)

  /**
   * TODO(prod): Static file requests should not enter here
   * @date - 31-07-2017
   * @time - 23:55
   */
  if (req.url.includes('.')) {
    return void res.sendStatus(404)
  }

  // home
  const pageUrl = req.url

  // stellium.io-home -> 103460287648712398723412345123
  const cacheKey = stringToCacheKey(RedisTable.WebsitePages, hostname, pageUrl)

  redisClient.get(cacheKey, (err, cachedPage) => {

    if (err) {
      Raven.captureException(err)
    }

    if (cachedPage) {
      try {
        req.app.locals[RequestKeys.CurrentPageObject] = JSON.parse(cachedPage)

        return next()
      } catch (err) {
        // Unable to parse cached page
        Raven.captureException(err)
      }
    }

    WebsitePageModel
      .findOne({[`url.${req.app.locals[RequestKeys.CurrentLanguage]}`]: pageUrl})
      .populate('user')
      .lean()
      .exec((err, pageObject) => {

        if (err) {
          res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR)
          return next(err)
        }

        if (!pageObject) {

          if (Globals.Production) {
            return void res.sendStatus(404)

          } else {
            // Overrides with stub files
            const seederPath = Globals.SeederPath + '/website_pages.json'

            delete require.cache[seederPath]

            const allPages = require(seederPath)

            pageObject = allPages.find(_page => _page.url[req.app.locals[RequestKeys.CurrentLanguage]] === pageUrl)
          }
        }

        if (!pageObject || typeof pageObject === 'undefined') {
          return next()
        }

        // save pageObject into request
        req.app.locals[RequestKeys.CurrentPageObject] = pageObject

        redisClient.set(cacheKey, JSON.stringify(pageObject), err => {
          if (err) {
            Raven.captureException(err)
          }
          next()
        })
      })
  })
}
