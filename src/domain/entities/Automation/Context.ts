import type { OutputValue, Template } from '@domain/services/Template'

export class Context {
  private _data: { [key: string]: object } = {}

  constructor(trigger: object) {
    this._data = { trigger }
  }

  fillTemplate = (template: Template): OutputValue => {
    return template.fill(this._data)
  }

  fillTemplateAsString = (template: Template): string => {
    return String(template.fill(this._data))
  }

  fillObjectTemplate = (input: Record<string, Template>): Record<string, OutputValue> => {
    return Object.entries(input).reduce((acc: Record<string, OutputValue>, [key, value]) => {
      acc[key] = value.fill(this._data)
      return acc
    }, {})
  }

  fillObjectTemplateAsString = (input: Record<string, Template>): Record<string, string> => {
    return Object.entries(input).reduce((acc: Record<string, string>, [key, value]) => {
      acc[key] = String(value.fill(this._data))
      return acc
    }, {})
  }

  set = (key: string, value: object) => {
    this._data[key] = value
  }

  get = (key: string): object => {
    return this._data[key]
  }
}
