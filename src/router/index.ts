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
import { currentTemplateMiddleware } from './middlewares/current_template'

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

webRouter.use(currentTemplateMiddleware)

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
