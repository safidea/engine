import type { Base } from './base'

export interface SingleSelect extends Base {
  field: 'SingleSelect'
  options: string[]
}
