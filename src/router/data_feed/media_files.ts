import { NextFunction, Request, Response } from 'express'
import { createClient } from 'redis'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { RequestKeys } from '../../helpers/request_keys'
import { WriteStub } from '../../utils/write_stub'
import { MediaFileModel } from '../../models/models/media_file'

const redisBlogClient = createClient({db: RedisTable.MediaFiles})

export const mediaFilesFeedMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  const cacheKey = stringToCacheKey(req.hostname)

  redisBlogClient.get(cacheKey, (err, cachedMedia) => {
    if (err) {
      /**
       * TODO(error): Error handling
       * @date - 7/7/17
       * @time - 3:52 PM
       */
    }
    if (cachedMedia) {
      req.app.locals[RequestKeys.MediaFiles] = JSON.parse(cachedMedia)
      return void next()
    }

    MediaFileModel
      .find({})
      .select('title url meta')
      .lean()
      .exec((err, media) => {
        if (err) {
          /**
           * TODO(error): Error handling
           * @date - 7/7/17
           * @time - 3:50 PM
           */
          return void res.sendStatus(500)
        }
        WriteStub(media, 'media_files')
        req.app.locals[RequestKeys.MediaFiles] = media
        next()
      })
  })
}
