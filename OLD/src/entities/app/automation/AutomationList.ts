import { DatabaseService } from '@entities/services/database/DatabaseService'
import { AppConfig } from '../AppConfig'
import { AppMappers } from '../AppMappers'
import { Automation } from './Automation'
import { AutomationParams } from './AutomationParams'
import { AutomationServices } from './AutomationServices'
import { TriggerEvent } from './trigger/TriggerEvent'
import { StorageService } from '@entities/services/storage/StorageService'
import { TemplaterService } from '@entities/services/templater/TemplaterService'
import { ConverterService } from '@entities/services/converter/ConverterService'
import { LoggerService } from '@entities/services/logger/LoggerService'

export type Emit = (event: TriggerEvent) => Promise<void>

export class AutomationList {
  private readonly automations: Automation[] = []
  private readonly services?: AutomationServices

  constructor(automations: AutomationParams[], mappers: AppMappers, config: AppConfig) {
    if (automations.length > 0) {
      const { database, storage, templater, converter, logger } = mappers
      if (!database) throw new Error('Database is required')
      if (!storage) throw new Error('Storage is required')
      if (!templater) throw new Error('Templater is required')
      if (!converter) throw new Error('Converter is required')
      if (!logger) throw new Error('Logger is required')
      const services = {
        database: new DatabaseService(database),
        storage: new StorageService(storage),
        templater: new TemplaterService(templater),
        converter: new ConverterService(converter),
        logger: new LoggerService(logger),
      }
      this.automations = automations.map(
        (automation) => new Automation(automation, services, config)
      )
      this.services = services
    }
  }

  get database(): DatabaseService {
    if (!this.services) throw new Error('Database is required')
    return this.services.database
  }

  get storage(): StorageService {
    if (!this.services) throw new Error('Storage is required')
    return this.services.storage
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
