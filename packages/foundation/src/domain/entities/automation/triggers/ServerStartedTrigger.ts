import { BaseTrigger } from './BaseTrigger'

export class ServerStartedTrigger extends BaseTrigger {
  constructor() {
    super('server_started')
  }
}
