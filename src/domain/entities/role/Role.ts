import type { Engine } from '../Engine'

export interface RoleConfig {
  name: string
}

export class Role implements Engine {
  name: string

  constructor(config: RoleConfig) {
    this.name = config.name
  }

  validateConfig() {
    return []
  }
}
