import { NextFunction, Request, Response } from 'express'
import { RequestKeys } from '../helpers/request_keys'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'

const redisRegistryClient = createClient({db: RedisTable.ClientRegistry})

// Fake client registry collection
const fakeRegistry = [
  {
    contact: {
      first_name: 'Boris',
      last_name: 'Lemke'
    },
    expiry: 1231234134,
    // A fixed sub-domain that was generated on client's registration
    stellium_path: 'stellium.stellium.dev',
    alias: [
      'stellium.dev',
      'stellium2.dev',
      'www.stellium.dev'
    ]
  }
]

// Fake client registry model
const ClientRegistryModel = {
  findMatch: (hostname: string, cb: (err: any, match: any) => void) => {
    const _match = fakeRegistry.find(_reg => _reg.alias.includes(hostname) || _reg.stellium_path === hostname)
    cb(null, _match)
  }
}

export const RegistryMiddleware = (req: Request, res: Response, next: NextFunction) => {

  redisRegistryClient.get(req.hostname, (err, cachedRegistry) => {

    if (err) {
      // TODO(error): Error handling
      console.log('redis error', err)
    }

    if (cachedRegistry) {
      req.app.locals[RequestKeys.RegistryObject] = JSON.parse(cachedRegistry)
      return void next()
    }

    ClientRegistryModel
      .findMatch(req.hostname, (err, match) => {

        if (err) {
          console.log('Error reading from redis')
          // TODO(error): Error handling
          return void res.sendStatus(404)
        }
        if (!match) {
          return void res.sendStatus(404)
        }

        redisRegistryClient.set(req.hostname, JSON.stringify(match), 'EX', 3600, err => {

          if (err) {
            // TODO(error): Error handling
            console.log('Error writing to redis')
          }

          req.app.locals[RequestKeys.RegistryObject] = match

          next()
        })
      })
  })
}
