import { RunningEngine } from './RunningEngine'

export class StoppedEngine {
  errors: string[] = []

  constructor(private config: unknown) {
    this.errors = []
  }

  async start() {
    if (this.errors.length > 0) {
      throw new Error('Cannot start engine with errors')
    }
    return new RunningEngine(this.config)
  }
}
