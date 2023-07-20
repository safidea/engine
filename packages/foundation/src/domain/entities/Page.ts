import { Component } from './Component'

export class Page {
  public components: Component[]
  public title?: string
  public path: string

  // TODO: we should not need a page as a parameter of a constructor
  constructor(page: Page) {
    // TODO: we should not need to instanciate components
    this.components = page.components.map((component) => new Component(component))
    this.title = page.title
    this.path = page.path
  }
}
