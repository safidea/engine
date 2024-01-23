import type { IEntity } from '../IEntity'
import type { IComponent } from './IComponent'

export class Component implements IEntity {
  name: string
  template: IComponent['template']

  constructor(config: IComponent) {
    const { name, template } = config
    this.name = name
    this.template = template
  }

  validateConfig() {
    // TODO: validate props and template
    return []
  }
}
