import { AppDrivers, AppConfig } from '../App'
import { Automation } from './Automation'
import { AutomationOptions } from './AutomationOptions'

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
}
