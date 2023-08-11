import { Trigger } from './Trigger'
import { Action } from './Action'

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

  executeActions() {
    for (const action of this._actions) {
      action.execute()
    }
  }
}
