import type { Database } from '@domain/services/Database'
import type { DatabaseTable } from '@domain/services/DatabaseTable'
import { SingleLineText } from '../Field/SingleLineText'
import { LongText } from '../Field/LongText'
import { DateTime } from '../Field/DateTime'
import type { Field } from '../Field'
import { CreatedRecord } from '../Record/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import { UpdatedRecord } from '../Record/Updated'

export interface HistoryRecord {
  automation_name: string
  automation_id: string
  trigger_data: object
  actions_data: object
  status: string
}

export interface Services {
  database: Database
  idGenerator: IdGenerator
}

export class History {
  private _table: DatabaseTable
  private _fields: Field[] = [
    new SingleLineText({ name: 'id', required: true }),
    new SingleLineText({ name: 'automation_name', required: true }),
    new SingleLineText({ name: 'automation_id', required: true }),
    new LongText({ name: 'trigger_data' }),
    new LongText({ name: 'actions_data' }),
    new SingleLineText({ name: 'status', required: true }),
    new DateTime({ name: 'created_at', required: true }),
    new DateTime({ name: 'updated_at' }),
  ]

  constructor(private _services: Services) {
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

  create = async (history: HistoryRecord): Promise<string> => {
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
