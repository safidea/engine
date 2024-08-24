import type { Base } from '../base'

export interface ReadRecord extends Base {
  service: 'Database'
  action: 'ReadRecord'
  table: string
  id: string
}
