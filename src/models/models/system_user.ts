import * as mongoose from 'mongoose'
import { Document, Model } from 'mongoose'
import { SystemUserSchema } from '../schemas'
import * as passportLocalMongoose from 'passport-local-mongoose'

export interface SystemUserDocument extends Document, SystemUserSchema {
  // _id: any
  _doc: SystemUserSchema
  password: string
  register: (user: SystemUserDocument, password: string, callback) => void
  authenticate: (password?: string, cb?: (err: any, user?: SystemUserDocument) => void) => void
  setPassword: (newPassword: string, cb: (err: any) => void) => void
}

const Schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'A user must have a first name']
  },
  last_name: {
    type: String,
    'default': ''
  },
  image: {
    type: String,
    'default': null
  },
  email: {
    unique: [true, 'A user with that email address exists. The email must be unique.'],
    type: String,
    lowercase: true,
    required: [true, 'A user must have an email address']
  },
  last_login: {
    type: Date,
    'default': null
  },
  salt: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  reset_password_token: {
    type: String,
    'default': null
  },
  reset_password_expiry: {
    type: Date,
    'default': null
  },
  created_at: {
    type: Date,
    'default': Date.now
  },
  updated_at: {
    type: Date,
    'default': Date.now
  },
  deleted_at: {
    type: Date,
    'default': null
  }
})

Schema.virtual('domains', function () {
})

export const SystemUserModel = mongoose.model<SystemUserDocument>('SystemUser', Schema, 'system_users')
