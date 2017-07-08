import * as express from 'express'
import { Request, Response, Router } from 'express'
import { websiteCacheMiddleware } from './cache_middleware'
import { defaultPageMiddleware } from './default_page_middleware'
import { multiLanguageMiddleware } from './multi_language_middleware'
import { systemSettingsMiddleware } from './system_settings_middleware'
import { websitePagesFeedMiddleware } from './data_feed/website_pages'
import { blogPostsFeedMiddleware } from './data_feed/blog_posts'
import { currentLanguageMiddleware } from './current_language_middleware'
import { renderFile } from 'ejs'
import { resolve } from 'path'

export const webRouter: Router = express.Router()

webRouter.use(systemSettingsMiddleware)

// Determine current language flag / => /en
webRouter.use(multiLanguageMiddleware)

// Defines the language for the current request
webRouter.use(currentLanguageMiddleware)

webRouter.use((req, res, next) => {
  console.log('req.app.locals.current_language\n', req.app.locals.current_language)
  next()
})

// Determine the default page URL
// /en => /home, /en/blah => /blah
webRouter.use(defaultPageMiddleware)

// Attempt to retrieve a cached version of the requested page,
// if it does not exists, continue request to render.
webRouter.use(websiteCacheMiddleware)

// DATA FEED MUST RESIDE BELOW THE CACHE MIDDLEWARE
/**
 * Accessible properties of BlogPost
 * - title
 * - tags
 * - cover
 * - status
 * - language
 * - url
 * - meta
 * - metrics
 */
webRouter.use(blogPostsFeedMiddleware)

/**
 * Accessible properties of WebsitePage
 * - title
 * - meta
 * - url
 * - status
 */
webRouter.use(websitePagesFeedMiddleware)

webRouter.use((req: Request, res: Response) => {
  console.log('req.url\n', req.url)
  renderFile(resolve(__dirname, '../../views/index.ejs'), req.app.locals, (err, rendered) => {
    res.send(rendered)
  })
})

webRouter.use((req: Request, res: Response) => {
  res.sendStatus(404)
})
