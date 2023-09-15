import { AppServices, AppConfig } from '../App'
import { Automation, AutomationContext } from './Automation'
import { AutomationParams } from './AutomationParams'
import { TriggerParams } from './trigger/TriggerParams'

export type Emit = (event: TriggerParams['event'], context?: AutomationContext) => Promise<void>

export class AutomationList {
  private readonly automations: Automation[]

  constructor(automations: AutomationParams[], services: AppServices, config: AppConfig) {
    this.automations = automations.map((automation) => new Automation(automation, services, config))
  }

  getByName(automationName: string): Automation | undefined {
    return this.automations.find((t: Automation) => t.name === automationName)
  }

  getAll(): Automation[] {
    return this.automations
  }

  async emit(event: TriggerParams['event'], context: AutomationContext = {}): Promise<void> {
    const { data, ...params } = context
    if (typeof data === 'object' && 'id' in data) params.id = data.id
    for (const automation of this.automations) {
      if (await automation.shouldTrigger(event, params)) {
        await automation.executeActions({ trigger: data })
      }
    }
  }
}
