import type { IBaseAction } from './base'

export interface ISingleSelectField extends IBaseAction {
  field: 'SingleSelect'
  options: string[]
}
