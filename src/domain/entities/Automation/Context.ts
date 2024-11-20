export type AutomationContextAction = {
  config: { name: string }
  input: object
  output: object
}

export class AutomationContext {
  status: 'succeed' | 'failed' = 'succeed'
  run: { trigger: object; actions: AutomationContextAction[] }
  data: { [key: string]: object }

  constructor(
    public id: string,
    trigger: object
  ) {
    this.data = { trigger }
    this.run = { trigger, actions: [] }
  }

  addSucceedAction = (action: AutomationContextAction) => {
    this.data[action.config.name] = action.output
    this.run.actions.push(action)
  }

  addFailedAction = (action: AutomationContextAction) => {
    this.addSucceedAction(action)
    this.status = 'failed'
  }
}
