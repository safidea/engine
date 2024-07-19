import type { Database } from '@domain/services/Database'
import { Base, type Params as BaseParams, type Interface } from './base'
import type { ToCreate } from '@domain/entities/Record/ToCreate'
import type { Context } from '../Automation/Context'

interface Params extends BaseParams {
  table: string
  recordToCreate: ToCreate
  database: Database
}

export class CreateRecord extends Base implements Interface {
  constructor(private params: Params) {
    super(params)
  }

  execute = async (context: Context) => {
    const { table, recordToCreate, database } = this.params
    const recordToCreateFilled = recordToCreate.fillWithContext(context)
    await database.table(table).insert(recordToCreateFilled)
  }
}
