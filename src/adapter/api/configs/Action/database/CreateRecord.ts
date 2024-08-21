import type { Base } from '../base'

export interface CreateRecord extends Base {
  service: 'Database'
  action: 'CreateRecord'
  table: string
  fields: { [key: string]: string | number | boolean }
}
