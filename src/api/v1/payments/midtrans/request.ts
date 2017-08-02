import { PaymentTypes } from './payment_methods'

export interface ItemDetail {
  id: string
  name: string
  price: number
  quantity: number
}

export type ItemDetails = ItemDetail[]

export interface CustAddress {
  first_name: string
  last_name: string
  phone: string
  address: string
  city: string
  postal_code: string
  country_code: string
}

// Represent the customer detail
export interface CustDetail {
  first_name: string
  last_name: string
  email: string
  phone: string
  billing_address: CustAddress
  customer_address: CustAddress
}

export interface TransactionDetails {
  order_id: string
  gross_amount: number
}

export interface SnapReq {
  transaction_details: TransactionDetails
  enabled_payments: PaymentTypes
  item_details: ItemDetails
  customer_details: CustDetail
}
