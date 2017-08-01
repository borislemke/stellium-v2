import { HasUser, Translatable } from './_common'

export interface RestaurantMenuSchema extends HasUser {
  _id?: string
  title: {
    title: Translatable
    subtitle: Translatable
  }
  config: {
    columns: number
  }
  data: any[]
}
