import type { Logger } from '@domain/services/Logger'
import type { Action } from '../Action'
import type { Trigger } from '../Trigger'
import { AutomationContext } from './Context'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { Monitor } from '@domain/services/Monitor'
import type { IdGenerator } from '@domain/services/IdGenerator'
import { AutomationHistory } from './History'
import type { Database } from '@domain/services/Database'

interface AutomationConfig {
  name: string
}

interface AutomationServices {
  logger: Logger
  monitor: Monitor
  idGenerator: IdGenerator
  database: Database
}

interface AutomationEntities {
  actions: Action[]
  trigger: Trigger
}

export class Automation {
  private _history: AutomationHistory

  constructor(
    private _config: AutomationConfig,
    private _services: AutomationServices,
    private _entities: AutomationEntities
  ) {
    this._history = new AutomationHistory(this._services)
  }

  get name() {
    return this._config.name
  }

  init = async () => {
    const { trigger, actions } = this._entities
    const { logger } = this._services
    await this._history.init()
    await trigger.init(this.run)
    logger.debug(`initializing automation "${this.name}"`)
    for (const action of actions) await action.init()
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  run = async (triggerData: object) => {
    const { actions } = this._entities
    const { logger, idGenerator } = this._services
    const id = idGenerator.forAutomation()
    const context = new AutomationContext(id, triggerData)
    const historyId = await this._history.create({
      automation_name: this.name,
      automation_id: id,
      trigger_data: triggerData,
      actions_data: [],
      status: 'running',
    })
    logger.debug(`"${this.name}": running automation "${id}"`)
    for (const action of actions) {
      await action.execute(context)
      await this._history.updateActions(historyId, context.run.actions)
    }
    await this._history.updateStatus(historyId, context.status)
    logger.debug(`"${this.name}": completed automation "${id}"`)
    logger.info(`"${this.name}" run ${context.status}`, context.run)
    return context
  }
}
