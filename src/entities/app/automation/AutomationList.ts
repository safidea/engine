import { AppDrivers, AppConfig } from '../App'
import { Automation, AutomationContext } from './Automation'
import { AutomationOptions } from './AutomationOptions'
import { TriggerOptions } from './trigger/TriggerOptions'

export type Emit = (event: TriggerOptions['event'], context?: AutomationContext) => Promise<void>

export class AutomationList {
  private readonly automations: Automation[]

  constructor(automations: AutomationOptions[], drivers: AppDrivers, config: AppConfig) {
    this.automations = automations.map((automation) => new Automation(automation, drivers, config))
  }

  getByName(automationName: string): Automation | undefined {
    return this.automations.find((t: Automation) => t.name === automationName)
  }

  getAll(): Automation[] {
    return this.automations
  }

  async emit(event: TriggerOptions['event'], context: AutomationContext = {}): Promise<void> {
    const { data, ...params } = context
    if (typeof data === 'object' && 'id' in data) params.id = data.id
    for (const automation of this.automations) {
      if (await automation.shouldTrigger(event, params)) {
        await automation.executeActions({ trigger: data })
      }
    }
  }
}
