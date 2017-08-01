import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'
import { stringToCacheKey } from '../helpers/url_cache'
import { WebsitePageModel } from '../models/models/website_page'
import { RequestKeys } from '../helpers/request_keys'
import { Globals } from '../globals'
import { RaygunClient } from '../utils/raygun'

const redisPagesClient = createClient({db: RedisTable.WebsitePages})

export const pageLoaderMiddleware = (req: Request, res: Response, next: NextFunction): void => {

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
  const cacheKey = stringToCacheKey(req.hostname, '_', pageUrl)

  redisPagesClient.get(cacheKey, (err, cachedPage) => {

    if (err) {
      RaygunClient.send(err)
    }

    if (cachedPage) {
      try {
        req.app.locals[RequestKeys.CurrentPageObject] = JSON.parse(cachedPage)

        return void next()

      } catch (e) {
        // Unable to parse cached page
        RaygunClient.send(new Error('Attempted to parse a cached page but failed'))
      }
    }

    WebsitePageModel
      .findOne({[`url.${req.app.locals[RequestKeys.CurrentLanguage]}`]: pageUrl})
      .populate('user')
      .lean()
      .exec((err, pageObject) => {

        if (err) {
          RaygunClient.send('Error fetching page object', err)
          return res.sendStatus(500)
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
          return void res.sendStatus(404)
        }

        // save pageObject into request
        req.app.locals[RequestKeys.CurrentPageObject] = pageObject

        redisPagesClient.set(cacheKey, JSON.stringify(pageObject), err => {
          if (err) {
            RaygunClient.send(err)
          }
          return void next()
        })
      })
  })
}
