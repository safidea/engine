import type { Logger } from '@domain/services/Logger'
import type { Engine } from '../Engine'
import type { Action } from './action'
import type { Trigger } from './trigger'

interface Params {
  name: string
  actions: Action[]
  trigger: Trigger
  logger: Logger
}

export class Automation implements Engine {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  validateConfig() {
    return []
  }
}
