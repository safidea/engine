import type { Logger } from '@domain/services/Logger'
import type { Action } from '../Action'
import type { Trigger } from '../Trigger'
import { Context } from './Context'
import type { ConfigError } from '@domain/entities/Error/Config'

interface Params {
  name: string
  actions: Action[]
  trigger: Trigger
  logger: Logger
}

export class Automation {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { logger } = _params
    this._log = logger.init('automation')
  }

  get name() {
    return this._params.name
  }

  init = async () => {
    const { trigger } = this._params
    await trigger.init(this.run)
    for (const action of this._params.actions) {
      await action.init()
    }
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  run = async (triggerData: object) => {
    const context = new Context(triggerData)
    const { actions } = this._params
    for (const action of actions) {
      this._log(`running action: ${action.name}`)
      await action.execute(context)
      this._log(`completed action: ${action.name}`)
    }
    return context
  }
}
