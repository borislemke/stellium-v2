import * as mongoose from 'mongoose'
import { Document, Schema } from 'mongoose'

export interface IStelliumCustomer {
  email: string
}

export interface IStelliumCustomerModel extends Document, IStelliumCustomer {
}

const schema = new Schema({
  full_name: {
    type: String
  },
  email: {
    type: String,
    required: true
  }
})

export const StelliumCustomer = mongoose.model<IStelliumCustomerModel>('StelliumCustomer', schema, 'stellium_customers')
