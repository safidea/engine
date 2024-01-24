import { components, type Components } from '@domain/components'

export class Controller {
  getComponents(customComponents?: Components): Components {
    return { ...components, ...customComponents }
  }
}
