import { Log } from '@domain/spi/log/LogSpi'
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

export interface TriggerRecordCreated {
  event: 'recordCreated'
  table: string
}

export interface TriggerOnStartup {
  event: 'on_startup'
}

export type Trigger = TriggerRecordCreated | TriggerOnStartup

export class Automation {
  constructor(
    private readonly _name: string,
    private readonly _trigger: Trigger,
    private readonly _actions: Action[],
    private tables: Table[],
    private log?: Log
  ) {
    this.validateActions()
  }

  get name(): string {
    return this._name
  }

  get actions(): Action[] {
    return this._actions
  }

  get trigger(): Trigger {
    return this._trigger
  }

  private validateActions() {
    for (const action of this._actions) {
      const { type } = action
      if (type === 'updateTable') {
        const table = this.tables.find((table) => table.name === action.table)
        if (!table) {
          throw new Error(
            `table "${action.table}" in automation "${this._name}" is not defined in tables`
          )
        }
        const fieldsNames = Object.keys(action.fields ?? {})
        const missingField = fieldsNames.find(
          (fieldName) => !table.fields.some((f) => f.name === fieldName)
        )
        if (missingField)
          throw new Error(
            `field "${missingField}" in automation "${this._name}" is not defined in table "${action.table}"`
          )
      } else if (type === 'log') {
        if (!action.message) {
          throw new Error(`message is required for log action in automation "${this._name}"`)
        }
      } else {
        throw new Error(`unsupported action type: ${type}`)
      }
    }
  }

  executeActions() {
    for (const action of this._actions) {
      const { type } = action
      if (type === 'log') {
        if (this.log) this.log(action.message)
      } else {
        throw new Error(`unimplemented action type: ${type}`)
      }
    }
  }

  shouldTrigger(event: string): boolean {
    return this._trigger.event === event
  }
}
