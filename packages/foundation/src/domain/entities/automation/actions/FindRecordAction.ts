import { BaseAction } from './BaseAction'
import { Table } from '@domain/entities/table/Table'
import { AutomationContext, AutomationUseCases } from '../Automation'
import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'

export class FindRecordAction extends BaseAction {
  private recordIdCompiled: ITemplatingSpi

  constructor(
    name: string,
    private _tableName: string,
    private _recordId: string,
    tables: Table[],
    templating: ITemplatingSpi
  ) {
    super(name, 'find_record')
    const table = tables.find((table) => table.name === _tableName)
    if (!table) {
      throw new Error(`table "${_tableName}" in action "update_record" is not defined in tables`)
    }
    this.recordIdCompiled = templating.compile(this._recordId)
  }

  get tableName(): string {
    return this._tableName
  }

  get recordId(): string {
    return this._recordId
  }

  async execute(
    context: AutomationContext,
    { readTableRecord, createAutomationContextFromRecord }: AutomationUseCases
  ) {
    const id = this.recordIdCompiled.render(context)
    const record = await readTableRecord.execute(this.tableName, id)
    const { data } = await createAutomationContextFromRecord.execute(this.tableName, record)
    return { [this.name]: data }
  }
}
