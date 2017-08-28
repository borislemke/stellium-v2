import * as moment from 'moment'
import { Document, model, Model, Schema } from 'mongoose'
import { SystemUserModel } from './system_user'
import { DDate, SoftDelete } from '../schemas/_common'
import { ISystemLanguage } from '../schemas/system_language'

export interface IStelliumDomain extends SoftDelete {
  title: string
  alias: string[]
  permanent_address: string // foo.stellium.io
  created_by: string
  users: {
    user_id: string
    role_id: number
  }[],
  expires_at: DDate
  languages: ISystemLanguage[]
}

export interface StelliumDomain extends Document, IStelliumDomain {
}

const domainMember = {
  user_id: {
    type: Schema.Types.ObjectId,
    ref: SystemUserModel.modelName
  },
  role_id: {
    type: Number,
    min: 0,
    max: 5
  }
}

const timestampProps = {
  created_at: {
    type: Date,
    'default': Date.now
  },
  updated_at: {
    type: Date,
    'default': null
  },
  deleted_at: {
    type: Date,
    'default': null
  }
}

const systemLanguages = {
  title: String,
  code: String,
  'default': {
    type: Boolean,
    'default': true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: SystemUserModel.modelName
  },
  status: Boolean,
  created_at: {
    type: Date,
    'default': Date.now
  }
}

const schema = new Schema({
  title: String,
  alias: [{
    type: String
  }],
  users: [domainMember],
  languages: [systemLanguages],
  created_by: {
    type: Schema.Types.ObjectId,
    ref: SystemUserModel.modelName
  },
  expires_at: {
    type: Date,
    'default': moment().add(30, 'd').format()
  },
  active_template: {
    type: String,
    'default': 'interstellar'
  },
  permanent_address: {
    type: String,
    required: true
  },
  ...timestampProps
})

export const DomainModel: Model<StelliumDomain> = model('StelliumDomain', schema, 'stellium_domains')
