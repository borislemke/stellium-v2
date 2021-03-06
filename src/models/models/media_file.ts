import * as mongoose from 'mongoose'
import { Document } from 'mongoose'
import { MediaFileSchema } from '../schemas'

export interface MongooseMediaFileSchema extends Document, MediaFileSchema {
  _id: any

  random (cb: (err: any, file?: MediaFileSchema) => void): MediaFileSchema
}

const Schema = new mongoose.Schema({
  url: {
    type: String
  },
  title: {
    type: String
  },
  folder: {
    type: String
  },
  type: {
    type: String
  },
  size: {
    type: Number
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  description: {
    type: mongoose.Schema.Types.Mixed
  },
  trash_name: {
    type: String
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    'default': Date.now
  },
  updated_at: {
    type: Date,
    'default': Date.now
  }
})

Schema.virtual('user', {
  ref: 'SystemUser',
  localField: 'user_id',
  foreignField: '_id'
})

Schema.statics.random = function (callback) {
  this.count(function (err, count) {
    if (err) {
      return callback(err)
    }
    const rand = Math.floor(Math.random() * count)
    this.findOne().skip(rand).exec(callback)
  }.bind(this))
}

export const MediaFileModel = mongoose.model<MongooseMediaFileSchema>('MediaFile', Schema, 'media_files')
