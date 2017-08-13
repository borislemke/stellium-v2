import { NextFunction, Request, Response } from 'express'
import { RequestKeys } from '../helpers/request_keys'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'
import { ArgusClient } from '../utils/argus'
import { HeaderKeys } from '../utils/header_keys'
import { stringToCacheKey } from '../helpers/url_cache'
import { extractStelliumDomain } from '../utils/extract_stellium_domain'

const clientsRegistry = require('../../clients.json')

const redisClient = createClient()

// Fake clients registry model
const ClientRegistryModel = {
  findMatch: (hostname: string, cb: (err: any, match: any) => void) => {
    const _match = clientsRegistry.find(_reg => _reg.alias.includes(hostname) || _reg.stellium_path === hostname)

    cb(null, _match)
  }
}

export const RegistryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const hostname = extractStelliumDomain(req)

  const hashUrl = stringToCacheKey(RedisTable.ClientRegistry, hostname)

  redisClient.get(hashUrl, (err, cachedRegistry) => {
    if (err) {
      ArgusClient.send(err)
    }

    if (cachedRegistry) {
      req.app.locals[RequestKeys.RegistryObject] = JSON.parse(cachedRegistry)

      return void next()
    }

    ClientRegistryModel.findMatch(hostname, (err, match) => {
      if (err) {
        ArgusClient.send(err)

        return void res.status(500).send('internal server error')
      }

      if (!match) {
        return void res.status(404).send('no matching client domain found')
      }

      redisClient.set(hashUrl, JSON.stringify(match), 'EX', 3600, err => {
        if (err) {
          ArgusClient.send(err)

          console.log('Error writing to redis')
        }

        req.app.locals[RequestKeys.RegistryObject] = match

        next()
      })
    })
  })
}
