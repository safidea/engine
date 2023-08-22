import { Trigger } from './Trigger'
import { Action } from './Action'
import { RecordData } from '@domain/entities/orm/Record/IRecord'
import { UpdateTableRecord } from '@application/usecases/table/UpdateTableRecord'

export interface AutomationContext {
  [key: string]: string | number | boolean | undefined | string[] | RecordData[] | AutomationContext
}

export class Automation {
  constructor(
    private readonly _name: string,
    private readonly _trigger: Trigger,
    private readonly _actions: Action[]
  ) {}

  get name(): string {
    return this._name
  }

  get actions(): Action[] {
    return this._actions
  }

  get trigger(): Trigger {
    return this._trigger
  }

  shouldTrigger(event: string, context: AutomationContext): boolean {
    return this._trigger.shouldTrigger(event, context)
  }

  async executeActions(context: AutomationContext, updateTableRecord: UpdateTableRecord) {
    for (const action of this._actions) {
      const result = await action.execute(context, updateTableRecord)
      context = { ...context, ...result }
    }
  }
}
