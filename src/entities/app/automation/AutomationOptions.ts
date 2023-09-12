import { ActionOptions } from './ActionOptions'
import { TriggerOptions } from './TriggerOptions'

export interface AutomationOptions {
  name: string
  trigger: TriggerOptions
  actions: ActionOptions[]
}
