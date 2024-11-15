import type { AutomationContext } from '../Automation/Context'

export interface BaseTriggerConfig {
  automation: string
}

export interface BaseTrigger {
  init: (run: (triggerData: object) => Promise<AutomationContext>) => Promise<void>
}
