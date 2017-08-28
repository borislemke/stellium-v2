export interface SystemUserSchema {
  // _id?: string
  first_name?: string
  last_name?: string
  image?: string
  email?: string
  username?: string
  password?: string
  role_id?: number
  status?: boolean
  last_login?: Date | number
  salt?: string
  hash?: string
  reset_password_token?: string
  reset_password_expiry?: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}
