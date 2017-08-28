import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { BlogPostModel } from '../../models/models/blog_post'
import { ReqKeys } from '../../helpers/request_keys'
import * as raven from 'raven'
import { extractStelliumDomain } from '../../utils/extract_stellium_domain'

const redisBlogClient = createClient()

export const blogPostsFeedMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const hostname = extractStelliumDomain(req)

  const queryStart = req.query['start'] || 1

  const queryLimit = req.query['limit'] || 24

  const sortBy = req.query['sort'] || 'created_at'

  const cacheKey = stringToCacheKey(RedisTable.BlogPosts, hostname, queryStart, queryLimit, sortBy)

  redisBlogClient.get(cacheKey, (err, posts) => {
    if (err) {
      raven.captureException(err)
    }

    if (posts) {
      req.app.locals[ReqKeys.DBPosts] = JSON.parse(posts)

      return void next()
    }

    BlogPostModel
      .find({})
      .skip(queryStart)
      .limit(queryLimit)
      .sort(sortBy)
      .select('title tags cover status language url meta metrics')
      .lean()
      .exec((err, posts) => {
        if (err) {
          return next(err)
        }

        req.app.locals[ReqKeys.DBPosts] = posts

        next()
      })
  })
}
