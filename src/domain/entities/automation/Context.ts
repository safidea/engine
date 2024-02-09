import type { Result as ResultTrigger } from './trigger'
import type { Template } from '@domain/services/Template'

export class Context {
  private data = {}

  constructor(trigger: ResultTrigger) {
    this.data = { trigger }
  }

  fillTemplate = (template: Template): string => {
    return template.fill(this.data)
  }
}
