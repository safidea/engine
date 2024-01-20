import type { IList } from '../IList'
import { ComponentEntity } from './ComponentEntity'
import type { IComponent } from './IComponent'

export class ComponentList implements IList<ComponentEntity> {
  components: ComponentEntity[] = []

  constructor(public config: IComponent[]) {
    this.components = config.map((component) => new ComponentEntity(component))
  }

  includes(name: string) {
    return this.components.some((component) => component.config.name === name)
  }

  find(name: string) {
    return this.components.find((component) => component.config.name === name)
  }
}
