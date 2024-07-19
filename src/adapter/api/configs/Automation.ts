import type { Action } from './Action'
import type { Trigger } from './Trigger'

export interface Automation {
  name: string
  trigger: Trigger
  actions: Action[]
}
