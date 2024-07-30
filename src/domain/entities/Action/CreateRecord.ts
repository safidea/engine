import { Base, type Params as BaseParams, type Interface } from './base'
import type { ToCreate } from '@domain/entities/Record/ToCreate'
import type { Context } from '../Automation/Context'
import type { Table } from '../Table'

interface Params extends BaseParams {
  recordToCreate: ToCreate
  table: Table
}

export class CreateRecord extends Base implements Interface {
  constructor(private _params: Params) {
    super(_params)
  }

  execute = async (context: Context) => {
    const { recordToCreate, table } = this._params
    const recordToCreateFilled = recordToCreate.fillWithContext(context)
    await table.db.insert(recordToCreateFilled)
  }
}
