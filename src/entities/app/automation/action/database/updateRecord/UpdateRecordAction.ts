import { BaseAction } from '../../base/BaseAction'
import { Table } from '@entities/app/table/Table'
import { AutomationConfig, AutomationContext } from '../../../Automation'
import { ITemplatingSpi } from '@entities/drivers/templater/ITemplatingSpi'
import { UpdateRecordActionOptions } from './UpdateRecordActionOptions'
import { AppDrivers } from '@entities/app/App'
import { RecordToUpdate } from '@entities/drivers/database/record/state/RecordToUpdate'

export type UpdateRecordActionFieldsCompiled = { [key: string]: ITemplatingSpi | string }

export class UpdateRecordAction extends BaseAction {
  private table: Table
  private fieldsCompiled: UpdateRecordActionFieldsCompiled
  private recordIdCompiled: ITemplatingSpi

  constructor(options: UpdateRecordActionOptions, drivers: AppDrivers, config: AutomationConfig) {
    const { name, type, table: tableName, fields, recordId } = options
    super({ name, type }, drivers, config)
    this.table = this.getTableByName(tableName)
    for (const fieldName of Object.keys(fields)) {
      this.tableFieldShouldExist(this.table, fieldName)
    }
    this.fieldsCompiled = Object.entries(fields).reduce(
      (acc: UpdateRecordActionFieldsCompiled, [key, value]) => {
        acc[key] = !key.includes('$') ? drivers.templater.compile(value) : value
        return acc
      },
      {}
    )
    this.recordIdCompiled = drivers.templater.compile(recordId)
    // TODO: vérifier si les références de contexte d'actions précédentes sont bien résolues
  }

  async execute(context: AutomationContext) {
    const fieldsValues = Object.entries(this.fieldsCompiled).reduce(
      (acc: { [key: string]: string }, [key, value]) => {
        acc[key] = typeof value === 'string' ? value : value.render(context)
        return acc
      },
      {}
    )
    const id = this.recordIdCompiled.render(context)
    const persistedRecord = await this.drivers.database.read(this.table, id)
    if (!persistedRecord) {
      this.throwError(`record ${id} not found in table ${this.table.name}`)
    }
    const recordToUpdate = new RecordToUpdate(persistedRecord.data(), this.table, fieldsValues)
    await this.drivers.database.update(this.table, recordToUpdate)
    const { data } = await this.createContextFromRecord(this.table, recordToUpdate.id)
    return { [this.name]: data }
  }
}
