import { Trigger } from './Trigger'
import { Action } from './Action'
import { RecordData } from '@domain/entities/orm/Record/IRecord'
import { UpdateTableRecord } from '@application/usecases/table/UpdateTableRecord'
import { ReadTableRecord } from '@application/usecases/table/ReadTableRecord'
import { CreateAutomationContextFromRecordId } from '@application/usecases/automation/CreateAutomationContextFromRecordId'

export interface AutomationContext {
  [key: string]: string | number | boolean | undefined | string[] | RecordData[] | AutomationContext
}

// TODO: remove application usecases from domain
export interface AutomationUseCases {
  updateTableRecord: UpdateTableRecord
  readTableRecord: ReadTableRecord
  createAutomationContextFromRecord: CreateAutomationContextFromRecordId
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

  async shouldTrigger(
    event: string,
    context: AutomationContext,
    usecases: AutomationUseCases
  ): Promise<boolean> {
    return this._trigger.shouldTrigger(event, context, usecases)
  }

  async executeActions(context: AutomationContext, usecases: AutomationUseCases) {
    for (const action of this._actions) {
      const result = await action.execute(context, usecases)
      context = { ...context, ...result }
    }
  }
}
