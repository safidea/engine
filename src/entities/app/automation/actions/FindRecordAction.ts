import { BaseAction } from './BaseAction'
import { AutomationConfig, AutomationContext } from '../Automation'
import { ITemplatingSpi } from '@entities/drivers/templater/ITemplatingSpi'
import { FindRecordActionOptions } from './FindRecordActionOptions'
import { AppDrivers } from '@entities/app/App'
import { Table } from '@entities/app/table/Table'

export class FindRecordAction extends BaseAction {
  private table: Table
  private recordIdCompiled: ITemplatingSpi

  constructor(options: FindRecordActionOptions, drivers: AppDrivers, config: AutomationConfig) {
    const { name, type, table: tableName, recordId } = options
    super({ name, type }, drivers, config)
    this.table = this.getTableByName(tableName)
    this.recordIdCompiled = drivers.templater.compile(recordId)
  }

  async execute(context: AutomationContext) {
    const id = this.recordIdCompiled.render(context)
    const record = await this.drivers.database.read(this.table.name, id)
    const { data } = await this.createContextFromRecord(this.table, record.id)
    return { [this.name]: data }
  }
}
