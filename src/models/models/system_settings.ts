import * as mongoose from 'mongoose'
import { Document } from 'mongoose'
import { ISystemSettingsSchema } from '../schemas'

export interface ISystemSettingsModel extends Document, ISystemSettingsSchema {
}

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed
    // required: true
  },
  key: {
    type: String,
    required: true
  },
  messages: [{
    /**
     * TODO(security): Change match type to enums of allowed types
     * @date - 07 Apr 2017
     * @time - 12:36 PM
     */
    match: String,
    value: mongoose.Schema.Types.Mixed,
    color: String,
    description: String
  }],
  locked: {
    type: Boolean,
    'default': false
  },
  allowed_roles: {
    type: [Number],
    'default': [1]
  },
  type: {
    type: String
  },
  settings_group: String,
  cache_dependencies: [String],
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

export const SystemSettingsModel = mongoose.model<ISystemSettingsModel>('SystemSettings', Schema, 'system_settings')
