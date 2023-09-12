import { TriggerEvent } from '@entities/app/automation/triggers/BaseTrigger'
import { ServerState } from './ServerState'
import { ConfiguredState } from './ConfiguredState'
import { AutomationContext } from '@entities/app/automation/Automation'
import { UpdateTableRecord } from '@usecases/table/UpdateTableRecord'
import { OrmSpi } from '@adapters/spi/orm/OrmSpi'
import { ReadTableRecord } from '@usecases/table/ReadTableRecord'
import { CreateAutomationContextFromRecordId } from '@usecases/automation/CreateAutomationContextFromRecordId'

export class StartedState extends ServerState {
  // TODO: mettre le constructeur en privé
  constructor(private configuredState: ConfiguredState) {
    super(configuredState.adapters)
  }

  // TODO: créer une instance à partir d'une méthode static asynchrone

  // static async start() {}

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
