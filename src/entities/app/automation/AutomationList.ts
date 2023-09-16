import { AppServices, AppConfig } from '../App'
import { Automation } from './Automation'
import { AutomationParams } from './AutomationParams'
import { TriggerEvent } from './trigger/TriggerEvent'

export type Emit = (event: TriggerEvent) => Promise<void>

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

  async emit(triggerEvent: TriggerEvent): Promise<void> {
    for (const automation of this.automations) {
      if (await automation.shouldTrigger(triggerEvent)) {
        await automation.executeActions({ trigger: triggerEvent.context })
      }
    }
  }
}
