import { AppServices, AppConfig } from '../App'
import { Automation } from './Automation'
import { AutomationParams } from './AutomationParams'
import { AutomationServices } from './AutomationServices'
import { TriggerEvent } from './trigger/TriggerEvent'

export type Emit = (event: TriggerEvent) => Promise<void>

export class AutomationList {
  private readonly automations: Automation[]
  readonly services: AutomationServices

  constructor(automations: AutomationParams[], services: AppServices, config: AppConfig) {
    const { database, storage, templater, converter, logger } = services
    if (!database) throw new Error('Database service is required')
    if (!storage) throw new Error('Storage service is required')
    if (!templater) throw new Error('Templater service is required')
    if (!converter) throw new Error('Converter service is required')
    if (!logger) throw new Error('Logger service is required')
    this.services = { database, storage, templater, converter, logger }
    this.automations = automations.map(
      (automation) => new Automation(automation, this.services, config)
    )
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

  exist(): boolean {
    return this.automations.length > 0
  }
}
