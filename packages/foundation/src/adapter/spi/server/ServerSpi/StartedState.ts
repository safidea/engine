import { TriggerEvent } from '@domain/entities/automation/triggers/BaseTrigger'
import { ServerState } from './ServerState'
import { ConfiguredState } from './ConfiguredState'
import { AutomationContext } from '@domain/entities/automation/Automation'
import { UpdateTableRecord } from '@application/usecases/table/UpdateTableRecord'
import { OrmSpi } from '@adapter/spi/orm/OrmSpi'

export class StartedState extends ServerState {
  constructor(private configuredState: ConfiguredState) {
    super(configuredState.adapters)
  }

  async emit(event: TriggerEvent, context: AutomationContext = {}): Promise<void> {
    const { automations } = this.configuredState.app
    const { data, ...params } = context
    const ormSpi = new OrmSpi(this.configuredState.adapters.orm, this.configuredState.app, this)
    const updateTableRecord = new UpdateTableRecord(ormSpi, this.configuredState.app, this)
    for (const automation of automations) {
      if (automation.shouldTrigger(event, params)) {
        await automation.executeActions({ trigger: data }, updateTableRecord)
      }
    }
  }

  async stop(): Promise<ServerState> {
    await this.adapters.server.stop()
    await this.emit('server_stopped')
    return this.configuredState
  }
}
