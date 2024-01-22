import type { IEntity } from '../IEntity'
import type { IComponent } from './IComponent'

export class Component implements IEntity {
  name: string

  constructor(config: IComponent) {
    this.name = config.name
  }

  validateConfig() {
    return []
  }
}
