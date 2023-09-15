import { FormConfig } from '../../FormComponent'
import { Record } from '@entities/drivers/database/record/Record'
import { BaseInputComponentParams } from './BaseInputComponentParams'
import { AppDrivers } from '@entities/app/App'
import { BaseComponent } from '../../../base/BaseComponent'
import { Table } from '@entities/app/table/Table'
import { AddRecord, RemoveRecord, UpdateRecord } from '../../FormComponentUI'

export interface BaseInputComponentProps {
  updateRecord: UpdateRecord
  addRecord: AddRecord
  removeRecord: RemoveRecord
  currentRecord: Record
  records: Record[]
}

export class BaseInputComponent extends BaseComponent {
  readonly table: Table
  readonly field: string
  readonly label?: string

  constructor(params: BaseInputComponentParams, drivers: AppDrivers, config: FormConfig) {
    const { type, field, label } = params
    super({ type }, drivers, config)
    this.field = field
    this.label = label
    this.table = this.getTableByName(config.formTableName)
  }
}
