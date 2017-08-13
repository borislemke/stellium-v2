import * as notify from 'node-notifier'
import * as mongoose from 'mongoose'
import { ConnectionOptions } from 'mongoose'
import { Application } from 'express'

(mongoose as any).Promise = global.Promise

const port: string = process.env.SERVICE_PORT || '3000'

const connectionHandler = (err: any, app: Application) => {

  if (err) {
    throw err
  }

  app.listen(port, () => {
    console.log('Server listening on port:', port)
    notify.notify({
      title: 'App started',
      message: 'Server listening on port ' + port,
      sound: true
    })
  })
}

const databaseName = process.env.DATABASE_NAME || 'growbali-dev'

export const Bootstrap = (app: Application) => {
  mongoose.connect(
    'mongodb://localhost/' + databaseName,
    {useMongoClient: true} as ConnectionOptions,
    err => connectionHandler(err, app)
  )
}
