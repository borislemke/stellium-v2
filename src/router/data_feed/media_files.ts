import * as raven from 'raven'
import { NextFunction, Request, Response } from 'express'
import { RedisTable } from '../../helpers/redis_table'
import { stringToCacheKey } from '../../helpers/url_cache'
import { ReqKeys } from '../../helpers/request_keys'
import { MediaFileModel } from '../../models/models/media_file'
import { extractStelliumDomain } from '../../utils/extract_stellium_domain'
import { RedisPromiseGet, RedisPromiseSet } from '../../utils/redis_promise'

export const mediaFilesFeedMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const hostname = extractStelliumDomain(req)

  const cacheKey = stringToCacheKey(RedisTable.MediaFiles, hostname)

  try {
    const cachedMedia = await RedisPromiseGet(cacheKey)

    if (cachedMedia) {
      req.app.locals[ReqKeys.DBMediaFiles] = JSON.parse(cachedMedia)
      return void next()
    }
  } catch (err) {
    raven.captureException(err)
  }

  try {
    const media = await MediaFileModel
      .find({})
      .select('title url meta')
      .lean()

    req.app.locals[ReqKeys.DBMediaFiles] = media

    next()

    try {
      await RedisPromiseSet(cacheKey, media)
    } catch (setError) {
      raven.captureException(setError)
    }
  } catch (err) {
    next(err)
  }
}
