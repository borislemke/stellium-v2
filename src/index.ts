/*
 Request
 --> Pull data
 */

import 'source-map-support/register'
import './dev'
import * as express from 'express'
import { Application } from 'express'
import * as mongoose from 'mongoose'
import { resolve } from 'path'
import { Globals } from './globals'
import { webRouter } from './router/index'
import { apiRouter } from './api/index'
import { RegistryMiddleware } from './registry/index'

// Main express app
const app: Application = express()

app.use(RegistryMiddleware)

// API Router
app.use('/api', apiRouter)

app.get('/theme-static/:themeName/*', (req, res) => {

  res.sendFile(resolve(Globals.TemplatesPath, req.params.themeName, 'public', req.params[0]), err => {
    if (err) {
      res.sendStatus(err.status)
    }
  })
})

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
