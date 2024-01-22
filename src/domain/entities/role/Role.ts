import type { IEntity } from '../IEntity'
import type { IRole } from './IRole'

export class Role implements IEntity {
  name: string

  constructor(config: IRole) {
    this.name = config.name
  }

  validateConfig() {
    return []
  }
}
