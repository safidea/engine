import type { Logger } from '@domain/services/Logger'
import type { Base } from '../base'
import type { Action } from './action'
import type { Result, Trigger } from './trigger'
import type { Queue } from '@domain/services/Queue'
import { Context } from './Context'

interface Params {
  name: string
  actions: Action[]
  trigger: Trigger
  logger: Logger
  queue: Queue
}

export class Automation implements Base {
  constructor(private params: Params) {
    const { queue } = params
    queue.job(this.name, this.job)
  }

  get name() {
    return this.params.name
  }

  validateConfig() {
    return []
  }

  job = async (trigger: Result) => {
    const { actions, logger } = this.params
    const context = new Context(trigger)
    for (const action of actions) {
      logger.log(`running action: ${action.name}`)
      await action.execute(context)
      logger.log(`completed action: ${action.name}`)
    }
  }
}
