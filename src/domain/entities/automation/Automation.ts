import type { Logger } from '@domain/services/Logger'
import type { Engine } from '../Engine'
import type { Action } from './action'
import type { Trigger } from './trigger'
import type { Queue } from '@domain/services/Queue'

interface Params {
  name: string
  actions: Action[]
  trigger: Trigger
  logger: Logger
  queue: Queue
}

export class Automation implements Engine {
  constructor(private params: Params) {
    const { queue } = params
    queue.job(this.name, async () => {
      // TODO: implement actions
    })
  }

  get name() {
    return this.params.name
  }

  validateConfig() {
    return []
  }
}
