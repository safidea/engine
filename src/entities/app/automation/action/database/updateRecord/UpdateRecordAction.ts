import { BaseAction } from '../../base/BaseAction'
import { Table } from '@entities/app/table/Table'
import { AutomationConfig, AutomationContext } from '../../../Automation'
import { ITemplaterService } from '@entities/services/templater/ITemplaterService'
import { UpdateRecordActionParams } from './UpdateRecordActionParams'
import { AppServices } from '@entities/app/App'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'

export type UpdateRecordActionFieldsCompiled = { [key: string]: ITemplaterService | string }

export class UpdateRecordAction extends BaseAction {
  private table: Table
  private fieldsCompiled: UpdateRecordActionFieldsCompiled
  private recordIdCompiled: ITemplaterService

  constructor(params: UpdateRecordActionParams, services: AppServices, config: AutomationConfig) {
    const { name, type, table: tableName, fields, recordId } = params
    super({ name, type }, services, config)
    this.table = this.getTableByName(tableName)
    for (const fieldName of Object.keys(fields)) {
      this.tableFieldShouldExist(this.table, fieldName)
    }
    this.fieldsCompiled = Object.entries(fields).reduce(
      (acc: UpdateRecordActionFieldsCompiled, [key, value]) => {
        acc[key] = !key.includes('$') ? services.templater.compile(value) : value
        return acc
      },
      {}
    )
    this.recordIdCompiled = services.templater.compile(recordId)
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
    const persistedRecord = await this.services.database.read(this.table, id)
    if (!persistedRecord) {
      this.throwError(`record ${id} not found in table ${this.table.name}`)
    }
    const recordToUpdate = new RecordToUpdate(persistedRecord.data(), this.table, fieldsValues)
    await this.services.database.update(this.table, recordToUpdate)
    const { data } = await this.createContextFromRecord(this.table, recordToUpdate.id)
    return { [this.name]: data }
  }
}
