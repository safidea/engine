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
  private _log: (message: string) => void

  constructor(
    private _config: Config,
    private _services: Services,
    private _entities: Entities
  ) {
    const { logger } = _services
    this._log = logger.init('automation')
  }

  get name() {
    return this._config.name
  }

  init = async () => {
    const { trigger, actions } = this._entities
    await trigger.init(this.run)
    for (const action of actions) {
      await action.init()
    }
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  run = async (triggerData: object) => {
    const context = new Context(triggerData)
    const { actions } = this._entities
    for (const action of actions) {
      try {
        this._log(`running action: ${action.name}`)
        await action.execute(context)
        this._log(`completed action: ${action.name}`)
      } catch (error) {
        if (error instanceof Error) {
          this._services.monitor.captureException(error)
          throw new Error(`${action.name}: ${error.message}`)
        }
        throw error
      }
    }
    return context
  }
}
