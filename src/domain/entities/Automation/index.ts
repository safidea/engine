import type { Logger } from '@domain/services/Logger'
import type { Action } from '../Action'
import type { Trigger } from '../Trigger'
import { Context } from './Context'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { Monitor } from '@domain/services/Monitor'
import type { IdGenerator } from '@domain/services/IdGenerator'
import { History } from './History'
import type { Database } from '@domain/services/Database'

interface Config {
  name: string
}

interface Services {
  logger: Logger
  monitor: Monitor
  idGenerator: IdGenerator
  database: Database
}

interface Entities {
  actions: Action[]
  trigger: Trigger
}

export class Automation {
  private _history: History

  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {
    this._history = new History(this._services)
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
    const context = new Context(id, triggerData)
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
