import { BaseTrigger } from './BaseTrigger'

export class ServerStoppedTrigger extends BaseTrigger {
  constructor() {
    super('server_stopped')
  }

  shouldTrigger(event: string): boolean {
    return super.shouldTriggerEvent(event)
  }
}
