export interface VANumber {
  Bank: string
  VANumber: string
}

export type VANumbers = VANumber[]

export interface Response {
  StatusCode: string
  StatusMessage: string
  PermataVaNumber: string
  SignKey: string
  CardToken: string
  SavedCardToken: string
  SavedTokenExpAt: string
  SecureToken: boolean
  Bank: string
  BillerCode: string
  BillKey: string
  XlTunaiOrderID: string
  BIIVaNumber: string
  ReURL: string
  ECI: string
  ValMessages: string[]
  Page: number
  TotalPage: number
  TotalRecord: number
  OrderID: string
  TransactionId: string
  TransactionTime: string
  TransactionStatus: string
  GrossAmount: string
  VANumbers: VANumbers
}

// Response after calling the Snap API
export interface SnapResponse {
  StatusCode: string
  Token: string
  ErrorMessages: string[]
}
