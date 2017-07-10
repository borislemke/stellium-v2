import { WebsitePageModel } from '../models/models/website_page'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'
import { stringToCacheKey } from '../helpers/url_cache'
import { RequestKeys } from '../helpers/request_keys'

const redisDefaultPageClient = createClient({db: RedisTable.DefaultPage})

export const defaultPageMiddleware = (req, res, next): void => {

  // /en => en, /en/home => en/home
  const strippedUrl = req.url.replace(/^\/+|\/+$/g, '')

  if (strippedUrl.includes('/')) {
    req.url = req.url.slice(4, req.url.length)
    next()
  } else {

    const currentLanguage = req.app.locals[RequestKeys.CurrentLanguage]

    const cacheKey = stringToCacheKey(req.hostname, currentLanguage)

    redisDefaultPageClient.get(cacheKey, (err, cachedDefaultPage) => {
      if (err) {
        /**
         * TODO(error): Error handling
         * @date - 7/7/17
         * @time - 8:00 PM
         */
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
          redisDefaultPageClient.set(cacheKey, JSON.stringify(page))
          req.url = page.url[currentLanguage]
          next()
        })
    })
  }
}
