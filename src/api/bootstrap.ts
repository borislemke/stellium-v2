import * as notify from 'node-notifier'
import * as mongoose from 'mongoose'
import { ConnectionOptions } from 'mongoose'
import { Application } from 'express'
import { SystemUserModel } from '../models/models/system_user'
import { Globals } from '../globals'
import { DomainModel } from '../models/models/stellium_domain'

(mongoose as any).Promise = global.Promise

const port: string = process.env.SERVICE_PORT || '3000'

const connectionHandler = (err: any, app: Application, fromApi: boolean) => {

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

  if (!fromApi) {
    return
  }

  SystemUserModel.findOne((err, user) => {
    if (err) {
      throw err
    }
    if (!user) {
      SystemUserModel.create(require(Globals.SeederPath + '/system_user.json'), (err, newUser) => {
        if (err) {
          throw err
        }
        DomainModel.findOne((err, domain) => {
          if (err) {
            throw err
          }
          if (!domain) {
            DomainModel.create({
              ...require(Globals.SeederPath + '/root_domain.json'),
              created_by: newUser['_id'],
              languages: [
                {
                  user_id: newUser['_id'],
                  title: 'English',
                  code: 'en',
                  status: true,
                  default: true
                }
              ]
            }, err => {
              if (err) {
                throw err
              }
            })
          }
        })
      })
    }
  })
}

const databaseName = process.env.DATABASE_NAME || 'stellium'

export const Bootstrap = (app: Application, fromApi = false) => {
  mongoose.connect(
    'mongodb://localhost/' + databaseName,
    {useMongoClient: true} as ConnectionOptions,
    err => connectionHandler(err, app, fromApi)
  )
}
