import type { Template } from '@domain/services/Template'

export class Context {
  private _data = {}

  constructor(trigger: object) {
    this._data = { trigger }
  }

  fillTemplate = (template: Template): string => {
    return template.fill(this._data)
  }
}
