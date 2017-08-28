import * as mongoose from 'mongoose'
import { Document, Schema } from 'mongoose'

export interface IStelliumCustomer {
  email: string
}

export interface IStelliumCustomerModel extends Document, IStelliumCustomer {
}

const schema = new Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
})

export const StelliumCustomer = mongoose.model<IStelliumCustomerModel>('StelliumCustomer', schema, 'stellium_customers')
