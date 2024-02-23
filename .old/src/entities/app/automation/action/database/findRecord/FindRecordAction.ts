import { BaseAction } from '../../base/BaseAction'
import { AutomationConfig, AutomationContext } from '../../../Automation'
import { FindRecordActionParams } from './FindRecordActionParams'
import { Table } from '@entities/app/table/Table'
import { AutomationServices } from '@entities/app/automation/AutomationServices'
import { ITemplaterMapper } from '@entities/services/templater/ITemplaterMapper'

export class FindRecordAction extends BaseAction {
  private table: Table
  private recordIdCompiled: ITemplaterMapper

  constructor(
    params: FindRecordActionParams,
    services: AutomationServices,
    config: AutomationConfig
  ) {
    const { name, type, table: tableName, recordId } = params
    super({ name, type }, services, config)
    this.table = this.getTableByName(tableName)
    this.recordIdCompiled = services.templater.compile(recordId)
  }

  async execute(context: AutomationContext) {
    const id = this.recordIdCompiled.render(context)
    const record = await this.services.database.read(this.table, id)
    if (!record) {
      this.throwError(`record "${id}" not found in table "${this.table.name}"`)
    }
    const { data } = await this.createContextFromRecord(this.table, record.id)
    return { [this.name]: data }
  }
}
