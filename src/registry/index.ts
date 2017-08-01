import { NextFunction, Request, Response } from 'express'
import { RequestKeys } from '../helpers/request_keys'
import { createClient } from 'redis'
import { RedisTable } from '../helpers/redis_table'
import { RaygunClient } from '../utils/raygun'

const redisClientRegistryClient = createClient({db: RedisTable.ClientRegistry})

// Fake clients registry collection
const dummyRegistry = [
  {
    contact: {
      first_name: 'Boris',
      last_name: 'Lemke'
    },
    expiry: 1231234134,
    // A fixed sub-domain that was auto-generated on clients's registration
    stellium_path: 'stellium.stellium.dev',
    alias: [
      'stellium.dev',
      'stellium2.dev',
      'www.stellium.dev'
    ]
  }
]

// Fake clients registry model
const ClientRegistryModel = {

  findMatch: (hostname: string, cb: (err: any, match: any) => void) => {

    const _match = dummyRegistry.find(_reg => _reg.alias.includes(hostname) || _reg.stellium_path === hostname)

    cb(null, _match)
  }
}

export const RegistryMiddleware = (req: Request, res: Response, next: NextFunction) => {

  redisClientRegistryClient.get(req.hostname, (err, cachedRegistry) => {

    if (err) {
      RaygunClient.send(err)
    }

    if (cachedRegistry) {

      req.app.locals[RequestKeys.RegistryObject] = JSON.parse(cachedRegistry)

      return void next()
    }

    ClientRegistryModel.findMatch(req.hostname, (err, match) => {

      if (err) {
        RaygunClient.send(err)

        return void res.sendStatus(404)
      }

      if (!match) {

        console.log('No matching clients domain found.')

        return void res.sendStatus(404)
      }

      redisClientRegistryClient.set(req.hostname, JSON.stringify(match), 'EX', 3600, err => {

        if (err) {
          RaygunClient.send(err)

          console.log('Error writing to redis')
        }

        req.app.locals[RequestKeys.RegistryObject] = match

        next()
      })
    })
  })
}
