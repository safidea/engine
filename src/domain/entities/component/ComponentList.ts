import { ComponentEntity } from './ComponentEntity'
import type { IComponent } from './IComponent'

export class ComponentList {
  components: ComponentEntity[] = []

  constructor(public config: IComponent[]) {
    this.components = config.map((component) => new ComponentEntity(component))
  }
}
