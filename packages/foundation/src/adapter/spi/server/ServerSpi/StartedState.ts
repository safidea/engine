import { TriggerEvent } from '@domain/entities/automation/triggers/BaseTrigger'
import { ServerState } from './ServerState'
import { ConfiguredState } from './ConfiguredState'
import { AutomationContext } from '@domain/entities/automation/Automation'

export class StartedState extends ServerState {
  constructor(private configuredState: ConfiguredState) {
    super(configuredState.adapters)
  }

  async emit(event: TriggerEvent, context: AutomationContext = {}): Promise<void> {
    const { automations } = this.configuredState.app
    for (const automation of automations) {
      if (automation.shouldTrigger(event, context)) {
        await automation.executeActions({ [event]: context })
      }
    }
  }

  async stop(): Promise<ServerState> {
    await this.adapters.server.stop()
    await this.emit('server_stopped')
    return this.configuredState
  }
}
