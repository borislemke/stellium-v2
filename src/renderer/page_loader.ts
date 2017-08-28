import * as url from 'url'
import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'
import { stringToCacheKey } from '../helpers/url_cache'
import { WebsitePageModel } from '../models/models/website_page'
import { ReqKeys } from '../helpers/request_keys'
import { Globals } from '../globals'
import { STATUS } from '../utils/response_code'
import { extractStelliumDomain } from '../utils/extract_stellium_domain'
import { ArgusClient } from '../utils/argus'

const redisClient = createClient()

export const pageLoaderMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const hostname = extractStelliumDomain(req)

  // home
  const pageUrl = url.parse(req.url).pathname

  /**
   * TODO(prod): Static file requests should not enter here
   * @date - 31-07-2017
   * @time - 23:55
   */
  if (pageUrl.includes('.')) {
    return void res.sendStatus(404)
  }

  // stellium.io-home -> 103460287648712398723412345123
  const cacheKey = stringToCacheKey(RedisTable.WebsitePages, hostname, pageUrl)

  redisClient.get(cacheKey, (err, cachedPage) => {

    if (err) {
      ArgusClient.send(err)
    }

    if (cachedPage) {
      try {
        req.app.locals[ReqKeys.CurrentPageObject] = JSON.parse(cachedPage)

        return next()
      } catch (err) {
        // Unable to parse cached page
        ArgusClient.send(err)
      }
    }

    WebsitePageModel
      .findOne({[`url.${req.app.locals[ReqKeys.CurrentLanguage]}`]: pageUrl})
      .populate('user')
      .lean()
      .exec((err, pageObject) => {

        if (err) {
          res.status(STATUS.INTERNAL_SERVER_ERROR)
          return next(err)
        }

        if (!pageObject) {

          if (Globals.Production) {
            return void res.sendStatus(STATUS.NOT_FOUND)

          } else {
            // Overrides with stub files
            const seederPath = Globals.SeederPath + '/website_pages.json'

            delete require.cache[seederPath]

            const allPages = require(seederPath)

            pageObject = allPages.find(_page => _page.url[req.app.locals[ReqKeys.CurrentLanguage]] === pageUrl)
          }
        }

        if (!pageObject || typeof pageObject === 'undefined') {
          res.status(STATUS.NOT_FOUND)
          return next(new Error('Page `' + pageUrl + '` not found'))
        }

        // save pageObject into request
        req.app.locals[ReqKeys.CurrentPageObject] = pageObject

        redisClient.set(cacheKey, JSON.stringify(pageObject), err => {
          if (err) {
            ArgusClient.send(err)
          }

          next()
        })
      })
  })
}
