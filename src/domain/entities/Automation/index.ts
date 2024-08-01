import type { Logger } from '@domain/services/Logger'
import type { Action } from '../Action'
import type { Trigger } from '../Trigger'
import type { Queue } from '@domain/services/Queue'
import { Context } from './Context'
import type { ConfigError } from '@domain/entities/Error/Config'

interface Params {
  name: string
  actions: Action[]
  trigger: Trigger
  logger: Logger
  queue: Queue
}

export class Automation {
  private _log: (message: string) => void

  constructor(private _params: Params) {
    const { queue, logger } = _params
    this._log = logger.init('automation')
    queue.job(this.name, this.job)
  }

  get name() {
    return this._params.name
  }

  init = async () => {
    const { trigger } = this._params
    await trigger.init()
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  job = async (data: object) => {
    const context = new Context(data)
    await this.run(context)
  }

  run = async (context: Context) => {
    const { actions } = this._params
    for (const action of actions) {
      this._log(`running action: ${action.name}`)
      await action.execute(context)
      this._log(`completed action: ${action.name}`)
    }
  }
}
