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

export const WebRouter: Router = express.Router()

WebRouter.use(systemSettingsMiddleware)

// Determine current language flag / => /en
WebRouter.use(multiLanguageMiddleware)

// Defines the language for the current request
WebRouter.use(currentLanguageMiddleware)

// Determine the default page URL
// /en => /home, /en/blah => /blah
WebRouter.use(defaultPageMiddleware)

// Attempt to retrieve a cached version of the requested page,
// if it does not exists, continue request to render.
WebRouter.use(websiteCacheMiddleware)

WebRouter.use(currentTemplateMiddleware)

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
WebRouter.use(blogPostsFeedMiddleware)

/**
 * Accessible properties of WebsitePage
 * - title
 * - meta
 * - url
 * - status
 */
WebRouter.use(websitePagesFeedMiddleware)

WebRouter.use(mediaFilesFeedMiddleware)

WebRouter.use(RendererRouter)

WebRouter.use((req: Request, res: Response) => {

  console.log('Last resort')

  res.sendStatus(404)
})
