import type { IList } from '../IList'
import { Component } from './Component'
import type { IComponent } from './IComponent'
import { base } from './base'

export class ComponentList implements IList<Component> {
  private components: Component[] = []

  constructor(config: IComponent[]) {
    // TODO: filter base component if config includes it with the same name
    this.components = [...config, ...base].map((component) => new Component(component))
  }

  validateConfig() {
    return this.components.flatMap((component) => component.validateConfig())
  }

  includes(name: string) {
    return this.components.some((component) => component.name === name)
  }

  find(name: string) {
    return this.components.find((component) => component.name === name)
  }
}
