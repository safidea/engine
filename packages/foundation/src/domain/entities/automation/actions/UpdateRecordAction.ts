import { Field } from '@domain/entities/table/Field'
import { BaseAction } from './BaseAction'
import { Table } from '@domain/entities/table/Table'
import { Record } from '@domain/entities/orm/Record'
import { AutomationContext, AutomationUseCases } from '../Automation'
import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'

export type UpdateRecordActionFieldsCompiled = { [key: string]: ITemplatingSpi | string }

export class UpdateRecordAction extends BaseAction {
  private table: Table
  private fieldsCompiled: UpdateRecordActionFieldsCompiled
  private recordIdCompiled: ITemplatingSpi

  constructor(
    name: string,
    private _tableName: string,
    private _recordId: string,
    private _fields: { [key: string]: string },
    tables: Table[],
    templating: ITemplatingSpi
  ) {
    super(name, 'update_record')
    const table = tables.find((table) => table.name === _tableName)
    if (!table) {
      throw new Error(`table "${_tableName}" in action "update_record" is not defined in tables`)
    }
    const fieldsNames = Object.keys(_fields ?? {})
    const missingField = fieldsNames.find(
      (fieldName) => !table.fields.some((f: Field) => f.name === fieldName)
    )
    if (missingField)
      throw new Error(
        `field "${missingField}" in action "update_record" is not defined in table "${_tableName}"`
      )
    this.table = table
    this.fieldsCompiled = Object.entries(_fields).reduce(
      (acc: UpdateRecordActionFieldsCompiled, [key, value]) => {
        acc[key] = !key.includes('$') ? templating.compile(value) : value
        return acc
      },
      {}
    )
    this.recordIdCompiled = templating.compile(this._recordId)
  }

  get tableName(): string {
    return this._tableName
  }

  get fields(): { [key: string]: string } {
    return this._fields
  }

  get recordId(): string {
    return this._recordId
  }

  async execute(
    context: AutomationContext,
    { updateTableRecord, createAutomationContextFromRecord }: AutomationUseCases
  ) {
    const fieldsValues = Object.entries(this.fieldsCompiled).reduce(
      (acc: { [key: string]: string }, [key, value]) => {
        acc[key] = typeof value === 'string' ? value : value.render(context)
        return acc
      },
      {}
    )
    const id = this.recordIdCompiled.render(context)
    const record = new Record({ id, ...fieldsValues }, this.table, 'update')
    await updateTableRecord.execute(this.tableName, record, id)
    const { data } = await createAutomationContextFromRecord.execute(this.tableName, record)
    return { [this.name]: data }
  }
}
