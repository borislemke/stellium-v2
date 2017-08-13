import { SettingsKeys } from '../../helpers/settings_keys'

export interface ISystemSettingsSchema {
  // _id?: string
  key: SettingsKeys
  value: string
  title: string
  description: string
  order: number
  allowed_roles: number[]
  created_at: Date
  updated_at: Date
  cache_dependencies: string[]
  locked: boolean
  messages: {
    match: string,
    value: any,
    color: string,
    description: string
  }[],
}
