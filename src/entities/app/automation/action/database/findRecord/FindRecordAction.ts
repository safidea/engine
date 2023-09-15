import { BaseAction } from '../../base/BaseAction'
import { AutomationConfig, AutomationContext } from '../../../Automation'
import { ITemplaterService } from '@entities/services/templater/ITemplaterService'
import { FindRecordActionParams } from './FindRecordActionParams'
import { AppServices } from '@entities/app/App'
import { Table } from '@entities/app/table/Table'

export class FindRecordAction extends BaseAction {
  private table: Table
  private recordIdCompiled: ITemplaterService

  constructor(params: FindRecordActionParams, services: AppServices, config: AutomationConfig) {
    const { name, type, table: tableName, recordId } = params
    super({ name, type }, services, config)
    this.table = this.getTableByName(tableName)
    this.recordIdCompiled = services.templater.compile(recordId)
  }

  async execute(context: AutomationContext) {
    const id = this.recordIdCompiled.render(context)
    const record = await this.services.database.read(this.table, id)
    if (!record) {
      this.throwError(`record ${id} not found in table ${this.table.name}`)
    }
    const { data } = await this.createContextFromRecord(this.table, record.id)
    return { [this.name]: data }
  }
}
