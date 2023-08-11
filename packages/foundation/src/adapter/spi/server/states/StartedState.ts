import { TriggerEvent } from '@domain/entities/automation/triggers/BaseTrigger'
import { ServerState } from '../ServerState'
import { ConfiguredState } from './ConfiguredState'

export class StartedState extends ServerState {
  constructor(private configuredState: ConfiguredState) {
    super(configuredState.adapters)
  }

  emit(event: TriggerEvent): void {
    const { automations } = this.configuredState.app
    for (const automation of automations) {
      if (automation.shouldTrigger(event)) {
        automation.executeActions()
      }
    }
  }

  async stop(): Promise<ServerState> {
    await this.adapters.server.stop()
    this.emit('server_stopped')
    return this.configuredState
  }
}
