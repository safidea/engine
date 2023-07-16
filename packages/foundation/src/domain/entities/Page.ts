import { Component } from './Component'

export class Page {
  public components: Component[]
  public path: string

  constructor(page: Page) {
    this.components = page.components.map((component) => new Component(component))
    this.path = page.path
  }
}
