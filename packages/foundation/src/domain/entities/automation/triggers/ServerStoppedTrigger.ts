import { BaseTrigger } from './BaseTrigger'

export class ServerStoppedTrigger extends BaseTrigger {
  constructor() {
    super('server_stopped')
  }
}
