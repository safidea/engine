import type { Engine } from '../Engine'

interface Params {
  name: string
}

export class Role implements Engine {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  validateConfig() {
    return []
  }
}
