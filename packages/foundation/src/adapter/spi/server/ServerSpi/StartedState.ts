import { TriggerEvent } from '@domain/entities/automation/triggers/BaseTrigger'
import { ServerState } from './ServerState'
import { ConfiguredState } from './ConfiguredState'
import { AutomationContext } from '@domain/entities/automation/Automation'
import { UpdateTableRecord } from '@application/usecases/table/UpdateTableRecord'
import { OrmSpi } from '@adapter/spi/orm/OrmSpi'
import { ReadTableRecord } from '@application/usecases/table/ReadTableRecord'
import { CreateAutomationContextFromRecordId } from '@application/usecases/automation/CreateAutomationContextFromRecordId'

export class StartedState extends ServerState {
  constructor(private configuredState: ConfiguredState) {
    super(configuredState.adapters)
  }

  async emit(event: TriggerEvent, context: AutomationContext = {}): Promise<void> {
    const { automations } = this.configuredState.app
    const { data, ...params } = context
    if (typeof data === 'object' && 'id' in data) params.id = data.id
    const ormSpi = new OrmSpi(this.configuredState.adapters.orm, this.configuredState.app, this)
    const updateTableRecord = new UpdateTableRecord(ormSpi, this.configuredState.app, this)
    const readTableRecord = new ReadTableRecord(ormSpi, this.configuredState.app)
    const createAutomationContextFromRecord = new CreateAutomationContextFromRecordId(
      ormSpi,
      this.configuredState.app
    )
    const usecases = { updateTableRecord, readTableRecord, createAutomationContextFromRecord }
    for (const automation of automations) {
      if (await automation.shouldTrigger(event, params, usecases)) {
        await automation.executeActions({ trigger: data }, usecases)
      }
    }
  }

  async stop(): Promise<ServerState> {
    await this.adapters.server.stop()
    await this.emit('server_stopped')
    return this.configuredState
  }
}
