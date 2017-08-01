import { Response } from 'express'
import { createClient } from 'redis'
import { readFile } from 'fs'
import { resolve } from 'path'
import { Globals } from '../globals'
import { RedisTable, StaticResourceKeys } from '../helpers/redis_table'
import { RaygunClient } from '../utils/raygun'

const staticRedisClient = createClient({db: RedisTable.StaticResources})

export const AccountNotFoundHandler = (res: Response) => {

  staticRedisClient.get(StaticResourceKeys.AccountNotFound, (err, html) => {

    if (err) {
      RaygunClient.send(err)
      return void res.sendStatus(500)
    }

    if (html) {
      return void res.status(404).send(html)
    }

    readFile(resolve(Globals.ViewsPath, 'static', 'not-found.html'), 'utf8', (err, _html) => {
      if (err) {
        RaygunClient.send(err)
        return void res.sendStatus(404)
      }

      res.status(404).send(_html)
    })
  })
}
