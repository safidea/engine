import type { Base } from './base'

export interface CreateRecord extends Base {
  action: 'CreateRecord'
  table: string
  fields: { [key: string]: string | number | boolean }
}
