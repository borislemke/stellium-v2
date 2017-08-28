import * as mongoose from 'mongoose'
import { ISystemLanguage } from '../schemas'
import { model, Model } from 'mongoose'

export interface ISystemLanguageSchema extends mongoose.Document, ISystemLanguage {
}

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'The title of the language is required']
  },
  code: {
    type: String,
    unique: [true, 'Cannot add a language that has been added']
  },
  'default': {
    type: Boolean,
    'default': false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SystemUser'
  },
  status: {
    type: Boolean,
    'default': true
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

export const SystemLanguageModel: Model<ISystemLanguageSchema> = model('SystemLanguages', Schema, 'system_languages')
