import type { Template } from '@domain/services/Template'

export class State {

  // TODO: Replace with real data
  private data = {
    url: {
      params: {
        id: '1',
      }
    }
  }

  constructor() {}

  fillTemplate = (template: Template): string => {
    return template.fill(this.data)
  }
}
