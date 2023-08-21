import { TriggerEvent } from '@domain/entities/automation/triggers/BaseTrigger'
import { ServerState } from './ServerState'
import { ConfiguredState } from './ConfiguredState'
import { ContextDataAction } from '@domain/entities/automation/actions/BaseAction'

export class StartedState extends ServerState {
  constructor(private configuredState: ConfiguredState) {
    super(configuredState.adapters)
  }

  async emit(event: TriggerEvent, data: ContextDataAction = {}): Promise<void> {
    const { automations } = this.configuredState.app
    for (const automation of automations) {
      if (automation.shouldTrigger(event)) {
        await automation.executeActions({ [event]: data })
      }
    }
  }

  async stop(): Promise<ServerState> {
    await this.adapters.server.stop()
    await this.emit('server_stopped')
    return this.configuredState
  }
}
