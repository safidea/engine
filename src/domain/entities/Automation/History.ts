import type { Database } from '@domain/services/Database'
import type { DatabaseTable } from '@domain/services/DatabaseTable'
import { SingleLineTextField } from '../Field/SingleLineText'
import { LongTextField } from '../Field/LongText'
import { DateTimeField } from '../Field/DateTime'
import type { Field } from '../Field'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { RecordFields } from '../Record'

export interface AutomationHistoryRecord extends RecordFields {
  automation_name: string
  trigger_data: string
  actions_data: string
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
    const record = await this._table.insert(history)
    return record.id
  }

  updateActions = async (id: string, actions: object): Promise<void> => {
    await this._table.update(id, {
      actions_data: JSON.stringify(actions),
    })
  }

  updateStatus = async (id: string, status: string): Promise<void> => {
    await this._table.update(id, { status })
  }
}
