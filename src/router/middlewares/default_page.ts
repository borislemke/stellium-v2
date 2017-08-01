import { WebsitePageModel } from '../../models/models/website_page'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { RequestKeys } from '../../helpers/request_keys'
import { Globals } from '../../globals'
import { RaygunClient } from '../../utils/raygun'

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
        RaygunClient.send(err)
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
            // TODO(error): Error handling, no default page found
            RaygunClient.send(err)
            return void res.sendStatus(404)
          }
          if (!page) {
            if (Globals.Production) {
              return void res.sendStatus(404)
            } else {
              page = require(Globals.ViewsPath + '/test.json')
            }
          }
          redisDefaultPageClient.set(cacheKey, JSON.stringify(page))
          req.url = page.url[currentLanguage]
          next()
        })
    })
  }
}
