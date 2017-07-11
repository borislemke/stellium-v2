import { Response } from 'express'
import { createClient } from 'redis'
import { RedisTable, StaticResourceKeys } from '../helpers/redis_table'
import { readFile } from 'fs'
import { Globals } from '../globals'
import { resolve } from 'path'

const staticRedisClient = createClient({db: RedisTable.StaticResources})

export const AccountNotFoundHandler = (res: Response) => {

  staticRedisClient.get(StaticResourceKeys.AccountNotFound, (err, html) => {

    if (err) {
      return void res.sendStatus(500)
    }

    if (html) {
      return void res.status(404).send(html)
    }

    readFile(resolve(Globals.ViewsPath, 'static', 'not-found.html'), 'utf8', (err, _html) => {
      if (err) {
        return void res.sendStatus(404)
      }
    })
  })
}
