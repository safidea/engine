import { Table } from '../table/Table'

export interface Action {
  type: 'updateTable'
  table: string
  fields: Record<string, string>
}

export class Automation {
  constructor(
    private readonly _name: string,
    private readonly _actions: Action[],
    _tables?: Table[]
  ) {
    for (const action of _actions) {
      if (action.type !== 'updateTable') throw new Error(`unsupported action type: ${action.type}`)
      const table = _tables?.find((table) => table.name === action.table)
      if (!table) {
        throw new Error(`table ${action.table} in automation ${_name} is not defined in tables`)
      }
      const fieldsNames = Object.keys(action.fields ?? {})
      const missingField = fieldsNames.find(
        (fieldName) => !table.fields.some((f) => f.name === fieldName)
      )
      if (missingField)
        throw new Error(`${missingField} in automation A is not defined in table "${action.table}"`)
    }
  }

  get name(): string {
    return this._name
  }

  get actions(): Action[] {
    return this._actions
  }
}
