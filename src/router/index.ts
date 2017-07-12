import * as express from 'express'
import { Request, Response, Router } from 'express'
import {
  currentLanguageMiddleware,
  defaultPageMiddleware,
  multiLanguageMiddleware,
  systemSettingsMiddleware,
  websiteCacheMiddleware
} from './middlewares'
import { blogPostsFeedMiddleware, mediaFilesFeedMiddleware, websitePagesFeedMiddleware } from './data_feed'
import { RendererRouter } from '../renderer'
import { RequestKeys } from '../helpers/request_keys'

export const webRouter: Router = express.Router()

webRouter.use(systemSettingsMiddleware)

// Determine current language flag / => /en
webRouter.use(multiLanguageMiddleware)

// Defines the language for the current request
webRouter.use(currentLanguageMiddleware)

// Determine the default page URL
// /en => /home, /en/blah => /blah
webRouter.use(defaultPageMiddleware)

// Attempt to retrieve a cached version of the requested page,
// if it does not exists, continue request to render.
webRouter.use(websiteCacheMiddleware)

webRouter.use((req, res, next) => {
  /**
   * TODO(production): Dynamic template selection
   * @date - 7/10/17
   * @time - 7:36 PM
   */
  req.app.locals[RequestKeys.CurrentTemplate] = 'fortress'
  next()
})

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

webRouter.use(mediaFilesFeedMiddleware)

webRouter.use(RendererRouter)

webRouter.use((req: Request, res: Response) => {
  res.sendStatus(404)
})
