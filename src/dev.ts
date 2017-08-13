import { createClient } from 'redis'
import { Globals } from './globals'

const redisClient = createClient()
redisClient.flushall()

// if (Globals.Production) {
//   console.log = () => {}
// }
