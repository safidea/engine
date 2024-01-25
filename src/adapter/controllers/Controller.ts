import { components, type Components } from '@domain/components'

export class Controller {
  getComponents(customComponents: Partial<Components> = {}): Components {
    return { ...components, ...customComponents }
  }
}
