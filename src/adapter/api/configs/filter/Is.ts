import type { Base } from './base'

export interface Is extends Base {
  operator: 'is'
  value: string
}
