export type AutomationContextAction = {
  config: { name: string }
  input: object
  output: object
}

export class AutomationContext {
  public status: 'succeed' | 'failed' = 'succeed'
  public run: { trigger: object; actions: AutomationContextAction[] }
  public data: { [key: string]: object }
  public error?: string

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

  addFailedAction = (action: AutomationContextAction, message: string) => {
    this.addSucceedAction(action)
    this.status = 'failed'
    this.error = message
  }
}
