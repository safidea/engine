import { BaseAction } from '../../base/BaseAction'
import { AutomationConfig, AutomationContext } from '../../../Automation'
import { ITemplatingSpi } from '@entities/drivers/templater/ITemplatingSpi'
import { FindRecordActionParams } from './FindRecordActionParams'
import { AppDrivers } from '@entities/app/App'
import { Table } from '@entities/app/table/Table'

export class FindRecordAction extends BaseAction {
  private table: Table
  private recordIdCompiled: ITemplatingSpi

  constructor(params: FindRecordActionParams, drivers: AppDrivers, config: AutomationConfig) {
    const { name, type, table: tableName, recordId } = params
    super({ name, type }, drivers, config)
    this.table = this.getTableByName(tableName)
    this.recordIdCompiled = drivers.templater.compile(recordId)
  }

  async execute(context: AutomationContext) {
    const id = this.recordIdCompiled.render(context)
    const record = await this.drivers.database.read(this.table, id)
    if (!record) {
      this.throwError(`record ${id} not found in table ${this.table.name}`)
    }
    const { data } = await this.createContextFromRecord(this.table, record.id)
    return { [this.name]: data }
  }
}
