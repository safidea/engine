import { StoppedEngine } from './StoppedEngine'

export class RunningEngine {
  constructor(private config: object) {}

  async stop() {
    return new StoppedEngine(this.config)
  }
}
