import type { Action } from './action'
import type { Trigger } from './trigger'

export interface Automation {
  name: string
  trigger: Trigger
  actions: Action[]
}


export type AutomationSchema = Automation