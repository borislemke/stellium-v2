import * as redis from 'redis'

const redisClient = redis.createClient()

export const RedisPromiseGet = (cacheKey: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    redisClient.get(cacheKey, (err, cached) => {
      if (err) {
        reject(err)
      } else {
        resolve(cached)
      }
    })
  })
}

export const RedisPromiseSet = (cacheKey: string, toCache: string | Object): Promise<string> => {
  return new Promise((resolve, reject) => {

    if (typeof toCache === 'object') {
      toCache = JSON.stringify(toCache)
    }

    redisClient.set(cacheKey, toCache as string, (err, cached) => {
      if (err) {
        reject(err)
      } else {
        resolve(cached)
      }
    })
  })
}
