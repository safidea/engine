import type { Logger } from '@domain/services/Logger'
import type { Action } from '../Action'
import type { Trigger } from '../Trigger'
import { Context } from './Context'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { Monitor } from '@domain/services/Monitor'
import type { IdGenerator } from '@domain/services/IdGenerator'

interface Config {
  name: string
}

interface Services {
  logger: Logger
  monitor: Monitor
  idGenerator: IdGenerator
}

interface Entities {
  actions: Action[]
  trigger: Trigger
}

export class Automation {
  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {}

  get name() {
    return this._config.name
  }

  init = async () => {
    const { trigger, actions } = this._entities
    const { logger } = this._services
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
    logger.debug(`"${this.name}": running automation "${id}"`)
    for (const action of actions) await action.execute(context)
    logger.debug(`"${this.name}": completed automation "${id}"`)
    logger.info(`"${this.name}" run ${context.status}`, context.run)
    return context
  }
}
