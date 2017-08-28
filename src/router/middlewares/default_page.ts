import { WebsitePageModel } from '../../models/models/website_page'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { ReqKeys } from '../../helpers/request_keys'
import { Globals } from '../../globals'
import * as raven from 'raven'
import { extractStelliumDomain } from '../../utils/extract_stellium_domain'

const redisClient = createClient()

export const defaultPageMiddleware = (req, res, next): void => {
  const hostname = extractStelliumDomain(req)

  // /en => en, /en/home => en/home
  const strippedUrl = req.url.replace(/^\/+|\/+$/g, '')

  if (strippedUrl.includes('/')) {
    req.url = req.url.slice(4, req.url.length)
    next()
  } else {

    const currentLanguage = req.app.locals[ReqKeys.CurrentLanguage]

    const cacheKey = stringToCacheKey(RedisTable.DefaultPage, hostname)

    redisClient.get(cacheKey, (err, cachedDefaultPage) => {
      if (err) {
        raven.captureException(err)
      }

      if (cachedDefaultPage) {
        req.url = (JSON.parse(cachedDefaultPage)).url[currentLanguage]

        return void next()
      }

      WebsitePageModel
        .findOne({
          'default': true
        })
        .lean()
        .exec((err, page: any) => {
          if (err) {
            return next(err)
          }

          if (!page) {
            if (Globals.Production) {
              raven.captureException(new Error('no default page found'))

              return void res.sendStatus(404)
            } else {
              page = require(Globals.ViewsPath + '/test.json')
            }
          }

          redisClient.set(cacheKey, JSON.stringify(page))

          req.url = page.url[currentLanguage]

          next()
        })
    })
  }
}
