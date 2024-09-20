import type { Logger } from '@domain/services/Logger'
import type { Action } from '../Action'
import type { Trigger } from '../Trigger'
import { Context } from './Context'
import type { ConfigError } from '@domain/entities/Error/Config'
import type { Monitor } from '@domain/services/Monitor'

interface Config {
  name: string
}

interface Services {
  logger: Logger
  monitor: Monitor
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
    logger.debug(`initializing automation: ${this.name}`)
    for (const action of actions) await action.init()
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  run = async (triggerData: object) => {
    const context = new Context(triggerData)
    const { actions } = this._entities
    const { logger } = this._services
    logger.debug(`running automation: ${this.name}`)
    for (const action of actions) await action.execute(context)
    logger.debug(`completed automation: ${this.name}`)
    return context
  }
}
