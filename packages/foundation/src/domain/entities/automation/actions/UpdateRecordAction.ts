import { Field } from '@domain/entities/table/Field'
import { BaseAction } from './BaseAction'
import { Table } from '@domain/entities/table/Table'

export class UpdateRecordAction extends BaseAction {
  constructor(
    name: string,
    private _table: string,
    private _recordId: string,
    private _fields: Record<string, string>,
    tables: Table[]
  ) {
    super(name, 'update_record')
    const table = tables.find((table) => table.name === _table)
    if (!table) {
      throw new Error(`table "${_table}" in action "update_record" is not defined in tables`)
    }
    const fieldsNames = Object.keys(_fields ?? {})
    const missingField = fieldsNames.find(
      (fieldName) => !table.fields.some((f: Field) => f.name === fieldName)
    )
    if (missingField)
      throw new Error(
        `field "${missingField}" in action "update_record" is not defined in table "${_table}"`
      )
  }

  get table(): string {
    return this._table
  }

  get fields(): Record<string, string> {
    return this._fields
  }

  get recordId(): string {
    return this._recordId
  }

  execute() {
    console.log('update a record')
  }
}
