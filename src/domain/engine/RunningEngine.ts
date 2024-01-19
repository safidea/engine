import { StoppedEngine } from './StoppedEngine'

export class RunningEngine {
  constructor(private config: unknown) {}

  async stop() {
    return new StoppedEngine(this.config)
  }
}
