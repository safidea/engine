import type { Database } from '@domain/services/Database'
import type { DatabaseTable } from '@domain/services/DatabaseTable'
import { SingleLineTextField } from '../Field/SingleLineText'
import { LongTextField } from '../Field/LongText'
import { DateTimeField } from '../Field/DateTime'
import type { Field } from '../Field'
import { CreatedRecord } from '../Record/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import { UpdatedRecord } from '../Record/Updated'

export interface AutomationHistoryRecord {
  automation_name: string
  trigger_data: object
  actions_data: object
  status: string
}

export interface AutomationHistoryServices {
  database: Database
  idGenerator: IdGenerator
}

export class AutomationHistory {
  private _table: DatabaseTable
  private _fields: Field[] = [
    new SingleLineTextField({ name: 'id', required: true }),
    new SingleLineTextField({ name: 'automation_name', required: true }),
    new LongTextField({ name: 'trigger_data' }),
    new LongTextField({ name: 'actions_data' }),
    new SingleLineTextField({ name: 'status', required: true }),
    new DateTimeField({ name: 'created_at', required: true }),
    new DateTimeField({ name: 'updated_at' }),
  ]

  constructor(private _services: AutomationHistoryServices) {
    this._table = this._services.database.table('_automations.histories', this._fields)
  }

  init = async () => {
    await this._table.dropView()
    const exists = await this._table.exists()
    if (exists) {
      await this._table.migrate()
    } else {
      await this._table.create()
    }
    await this._table.createView()
  }

  create = async (history: AutomationHistoryRecord): Promise<string> => {
    const record = new CreatedRecord(
      {
        ...history,
        trigger_data: JSON.stringify(history.trigger_data),
        actions_data: JSON.stringify(history.actions_data),
      },
      { idGenerator: this._services.idGenerator }
    )
    await this._table.insert(record)
    return record.id
  }

  updateActions = async (id: string, actions: object): Promise<void> => {
    const record = new UpdatedRecord({
      id,
      actions_data: JSON.stringify(actions),
    })
    await this._table.update(record)
  }

  updateStatus = async (id: string, status: string): Promise<void> => {
    const record = new UpdatedRecord({
      id,
      status,
    })
    await this._table.update(record)
  }
}
