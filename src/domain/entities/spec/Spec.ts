import type { IEntity } from '../IEntity'
import type { ISpec } from './ISpec'

export class Spec implements IEntity {
  name: string

  constructor(config: ISpec) {
    this.name = config.name
  }

  validateConfig() {
    return []
  }
}
