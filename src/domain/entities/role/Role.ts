import type { Engine } from '../Engine'
import type { EngineError } from '../EngineError'

interface Params {
  name: string
}

export class Role implements Engine {
  constructor(private params: Params) {}

  get name() {
    return this.params.name
  }

  validateConfig(): EngineError[] {
    return []
  }
}
