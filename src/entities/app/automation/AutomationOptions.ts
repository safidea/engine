import { ActionOptions } from './action/ActionOptions'
import { TriggerOptions } from './trigger/TriggerOptions'

export interface AutomationOptions {
  name: string
  trigger: TriggerOptions
  actions: ActionOptions[]
}
