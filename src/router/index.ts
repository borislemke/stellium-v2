import * as express from 'express'
import { Router } from 'express'
import {
  currentLanguageMiddleware,
  currentTemplateMiddleware,
  defaultPageMiddleware,
  filterGetOnlyMethods,
  systemSettingsMiddleware,
  websiteCacheMiddleware
} from './middlewares'
import { blogPostsFeedMiddleware, mediaFilesFeedMiddleware, websitePagesFeedMiddleware } from './data_feed'
import { RendererRouter } from '../renderer'

export const WebRouter: Router = express.Router()

WebRouter.use(filterGetOnlyMethods)

WebRouter.use(systemSettingsMiddleware)

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
