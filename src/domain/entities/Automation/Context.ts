import type { OutputFormat, Template } from '@domain/services/Template'

export class Context {
  private _data: { [key: string]: object } = {}

  constructor(trigger: object) {
    this._data = { trigger }
  }

  fillTemplate = (template: Template): OutputFormat => {
    return template.fill(this._data)
  }

  fillTemplateAsString = (template: Template): string => {
    return String(template.fill(this._data))
  }

  set = (key: string, value: object) => {
    this._data[key] = value
  }

  get = (key: string): object => {
    return this._data[key]
  }
}
