import * as raven from 'raven'
import { createClient } from 'redis'
import { NextFunction, Request, Response } from 'express'
import { ReqKeys } from '../helpers/request_keys'
import { RedisTable } from '../helpers/redis_table'
import { stringToCacheKey } from '../helpers/url_cache'
import { extractStelliumDomain } from '../utils/extract_stellium_domain'
import { DomainModel } from '../models/models/stellium_domain'
import { STATUS } from '../utils/response_code'

const redisClient = createClient()

/**
 * TODO(opt): Optimise flow
 * @date - 17-08-2017
 * @time - 23:03
 */
export const RegistryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const hostname = extractStelliumDomain(req)

  const hashUrl = stringToCacheKey(RedisTable.ClientRegistry, hostname)

  redisClient.get(hashUrl, (err, cachedRegistry) => {
    if (err) {
      raven.captureException(err)
    }

    if (cachedRegistry) {
      const cachedRegistryObject = JSON.parse(cachedRegistry)

      req.app.locals[ReqKeys.RegistryObject] = cachedRegistryObject

      req.app.locals[ReqKeys.DBLanguages] = cachedRegistryObject.languages

      return void next()
    }

    DomainModel.findOne({alias: {$in: [hostname]}}, (err, match) => {
      if (err) {
        raven.captureException(err)

        return void res.status(500).send('internal server error')
      }

      if (!match) {
        const hostPrefix = hostname.replace(/.stellium.dev$/, '')

        DomainModel.findOne({permanent_address: hostPrefix}, (err, match) => {
          if (err) {
            raven.captureException(err)

            return void res.sendStatus(STATUS.INTERNAL_SERVER_ERROR)
          }

          if (!match) {
            /**
             * TODO(production): Stellium 404 Page
             * @date - 17-08-2017
             * @time - 22:12
             */
            return void res.sendStatus(STATUS.NOT_FOUND)
          }

          req.app.locals[ReqKeys.RegistryObject] = match

          req.app.locals[ReqKeys.DBLanguages] = match.languages

          next()
        })

      } else {

        redisClient.set(hashUrl, JSON.stringify(match), 'EX', 3600, err => {
          if (err) {
            raven.captureException(err)
          }

          req.app.locals[ReqKeys.RegistryObject] = match

          req.app.locals[ReqKeys.DBLanguages] = match.languages

          next()
        })
      }
    })
  })
}
