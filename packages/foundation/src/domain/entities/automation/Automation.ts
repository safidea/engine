import { Trigger } from './Trigger'
import { Action } from './Action'
import { ContextAction } from './actions/BaseAction'

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

  shouldTrigger(event: string): boolean {
    return this._trigger.event === event
  }

  async executeActions(context: ContextAction) {
    for (const action of this._actions) {
      const result = await action.execute(context)
      context = { ...context, ...result }
    }
  }
}
