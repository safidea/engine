import type { Base } from './base'

export interface IsAnyOf extends Base {
  operator: 'isAnyOf'
  value: string[]
}
