import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { BlogPostModel } from '../../models/models/blog_post'
import { RequestKeys } from '../../helpers/request_keys'

const redisBlogClient = createClient({db: RedisTable.BlogPosts})

export const blogPostsFeedMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  const queryStart = req.query['start'] || 1

  const queryLimit = req.query['limit'] || 24

  const sortBy = req.query['sort'] || 'created_at'

  const cacheKey = stringToCacheKey(req.hostname, queryStart, queryLimit, sortBy)

  redisBlogClient.get(cacheKey, (err, posts) => {
    if (err) {
      /**
       * TODO(error): Error handling
       * @date - 7/7/17
       * @time - 3:52 PM
       */
    }
    if (posts) {
      req.app.locals[RequestKeys.DBPosts] = JSON.parse(posts)
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
          /**
           * TODO(error): Error handling
           * @date - 7/7/17
           * @time - 3:50 PM
           */
          return void res.sendStatus(500)
        }
        req.app.locals[RequestKeys.DBPosts] = posts
        next()
      })
  })
}
