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
  private log: (message: string) => void

  constructor(private params: Params) {
    const { queue, logger } = params
    this.log = logger.init('automation')
    queue.job(this.name, this.job)
  }

  get name() {
    return this.params.name
  }

  init = async () => {
    const { trigger } = this.params
    await trigger.init()
  }

  validateConfig = async (): Promise<ConfigError[]> => {
    return []
  }

  job = async (data: object) => {
    const { actions } = this.params
    const context = new Context(data)
    for (const action of actions) {
      this.log(`running action: ${action.name}`)
      await action.execute(context)
      this.log(`completed action: ${action.name}`)
    }
  }
}
