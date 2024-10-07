import type { OutputValue, Template } from '@domain/services/Template'

export type ActionContext = { config: { name: string }; input: object; output: object }

export class Context {
  status: 'succeed' | 'failed' = 'succeed'
  run: { trigger: object; actions: ActionContext[] }
  private _data: { [key: string]: object }

  constructor(
    public id: string,
    trigger: object
  ) {
    this._data = { trigger }
    this.run = { trigger, actions: [] }
  }

  fillTemplate = (template: Template): OutputValue => {
    return template.fill(this._data)
  }

  fillTemplateAsString = (template: Template): string => {
    return String(template.fill(this._data))
  }

  fillObjectTemplate = (input: { [key: string]: Template }): { [key: string]: OutputValue } => {
    return Object.entries(input).reduce((acc: { [key: string]: OutputValue }, [key, value]) => {
      acc[key] = value.fill(this._data)
      return acc
    }, {})
  }

  fillObjectTemplateAsString = (input: { [key: string]: Template }): { [key: string]: string } => {
    return Object.entries(input).reduce((acc: { [key: string]: string }, [key, value]) => {
      acc[key] = String(value.fill(this._data))
      return acc
    }, {})
  }

  addSucceedAction = (action: ActionContext) => {
    this._data[action.config.name] = action.output
    this.run.actions.push(action)
  }

  addFailedAction = (action: ActionContext) => {
    this.addSucceedAction(action)
    this.status = 'failed'
  }
}
