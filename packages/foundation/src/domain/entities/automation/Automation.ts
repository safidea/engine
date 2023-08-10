import { App } from '../app/App'
import { Table } from '../table/Table'

export interface ActionTable {
  type: 'updateTable'
  table: string
  fields: Record<string, string>
}

export interface ActionLog {
  type: 'log'
  message: string
}

export type Action = ActionTable | ActionLog

export class Automation {
  constructor(
    private readonly _name: string,
    private readonly _actions: Action[],
    tables: Table[],
    log: any
  ) {
    for (const action of _actions) {
      const { type } = action
      if (type === 'updateTable') {
        const table = tables.find((table) => table.name === action.table)
        if (!table) {
          throw new Error(
            `table "${action.table}" in automation "${_name}" is not defined in tables`
          )
        }
        const fieldsNames = Object.keys(action.fields ?? {})
        const missingField = fieldsNames.find(
          (fieldName) => !table.fields.some((f) => f.name === fieldName)
        )
        if (missingField)
          throw new Error(
            `field "${missingField}" in automation "${_name}" is not defined in table "${action.table}"`
          )
      } else if (type === 'log') {
        if (!action.message) {
          throw new Error(`message is required for log action in automation "${_name}"`)
        }
        log(action.message)
      } else {
        throw new Error(`unsupported action type: ${type}`)
      }
    }
  }

  get name(): string {
    return this._name
  }

  get actions(): Action[] {
    return this._actions
  }
}
