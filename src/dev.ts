import { createClient } from 'redis'

const redisClient = createClient()
redisClient.flushall()
