import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { BlogPostModel } from '../../models/models/blog_post'

const redisBlogClient = createClient({db: RedisTable.BlogPosts})

export const blogPostsFeedMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  const cacheKey = stringToCacheKey(req.hostname)

  redisBlogClient.get(cacheKey, (err, posts) => {
    if (err) {
      /**
       * TODO(error): Error handling
       * @date - 7/7/17
       * @time - 3:52 PM
       */
    }
    if (posts) {
      req.app.locals.db_posts = JSON.parse(posts)
      return void next()
    }

    BlogPostModel
      .find({})
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
        req.app.locals.db_posts = posts
        next()
      })
  })
}
