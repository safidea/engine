import type { IList } from '../IList'
import { Component } from './Component'
import type { IComponent } from './IComponent'

export class ComponentList implements IList<Component> {
  private components: Component[] = []

  constructor(config: IComponent[]) {
    this.components = config.map((component) => new Component(component))
  }

  validateConfig() {
    return []
  }

  includes(name: string) {
    return this.components.some((component) => component.name === name)
  }

  find(name: string) {
    return this.components.find((component) => component.name === name)
  }
}
