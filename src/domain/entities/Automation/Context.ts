import type { TemplateOutputValue, Template } from '@domain/services/Template'

export type AutomationContextAction = {
  config: { name: string }
  input: object
  output: object
}

export class AutomationContext {
  status: 'succeed' | 'failed' = 'succeed'
  run: { trigger: object; actions: AutomationContextAction[] }
  private _data: { [key: string]: object }

  constructor(
    public id: string,
    trigger: object
  ) {
    this._data = { trigger }
    this.run = { trigger, actions: [] }
  }

  fillTemplate = (template: Template): TemplateOutputValue => {
    return template.fill(this._data)
  }

  fillTemplateAsString = (template: Template): string => {
    return String(template.fill(this._data))
  }

  fillObjectTemplate = (input: {
    [key: string]: Template
  }): { [key: string]: TemplateOutputValue } => {
    return Object.entries(input).reduce(
      (acc: { [key: string]: TemplateOutputValue }, [key, value]) => {
        acc[key] = value.fill(this._data)
        return acc
      },
      {}
    )
  }

  fillObjectTemplateAsString = (input: { [key: string]: Template }): { [key: string]: string } => {
    return Object.entries(input).reduce((acc: { [key: string]: string }, [key, value]) => {
      acc[key] = String(value.fill(this._data))
      return acc
    }, {})
  }

  addSucceedAction = (action: AutomationContextAction) => {
    this._data[action.config.name] = action.output
    this.run.actions.push(action)
  }

  addFailedAction = (action: AutomationContextAction) => {
    this.addSucceedAction(action)
    this.status = 'failed'
  }
}
