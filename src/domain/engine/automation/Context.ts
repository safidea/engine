import type { Template } from '@domain/services/Template'

export class Context {
  private data = {}

  constructor(trigger: object) {
    this.data = { trigger }
  }

  fillTemplate = (template: Template): string => {
    return template.fill(this.data)
  }
}
