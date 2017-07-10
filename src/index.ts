/*
 Request
 --> Pull data
 */

import './globals'
import * as express from 'express'
import { Application } from 'express'
import * as mongoose from 'mongoose'
import { webRouter } from './router/index'
import { apiRouter } from './api/index'
import { createClient } from 'redis'
import { RedisTable } from './helpers/redis_table'

const redisClient = createClient({db: RedisTable.WebsitePages})
redisClient.flushall()

// Main express app
const app: Application = express()

// API Router
app.use('/api', apiRouter)

// WEB Router
app.use(webRouter)

const port = process.env.SERVICE_PORT

if (!port) {
  console.warn(`No port set, server will listen on port 3000`)
}

(mongoose as any).Promise = global.Promise
mongoose.connect('mongodb://localhost/growbali-dev', {useMongoClient: true} as any, err => {

  if (err) {
    throw err
  }

  app.listen(port, () => {
    console.log('Server listening on port:', port)
  })
})
