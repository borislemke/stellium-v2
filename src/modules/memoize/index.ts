import * as redis from 'redis'
import { RedisTable } from '../../helpers/redis_table'

const redisClient = redis.createClient()

export const MemoizeCache = () => {

  return {
    get: (table: RedisTable, key: string): Promise<string> => {
      return new Promise((resolve, reject) => {

        redisClient.get(key, (err, cache) => {
          if (err) {
            return reject(err)
          }
          resolve(cache)
        })
      })
    }
  }
}
