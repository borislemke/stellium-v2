import { Response } from 'express'
import { createClient } from 'redis'
import { readFile } from 'fs'
import { resolve } from 'path'
import { Globals } from '../globals'
import { RedisTable, StaticResourceKeys } from '../helpers/redis_table'
import { ArgusClient } from '../utils/argus'
import { stringToCacheKey } from '../helpers/url_cache'

const staticClient = createClient()

export const AccountNotFoundHandler = (res: Response) => {

  const staticHash = stringToCacheKey(RedisTable.StaticResources, StaticResourceKeys.AccountNotFound)

  staticClient.get(staticHash, (err, html) => {

    if (err) {
      ArgusClient.send(err)
      return void res.sendStatus(500)
    }

    if (html) {
      return void res.status(404).send(html)
    }

    readFile(resolve(Globals.ViewsPath, 'static', 'not-found.html'), 'utf8', (err, _html) => {
      if (err) {
        ArgusClient.send(err)
        return void res.sendStatus(404)
      }

      res.status(404).send(_html)
    })
  })
}
