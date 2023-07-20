import { PageDto } from '@application/dtos/PageDto'
import { Component } from './Component'
import { Link } from './Link'
import { Paragraph } from './Paragraph'

export class Page {
  public components: Component[]
  public title?: string
  public path: string

  // TODO: we should not rely on a DTO here
  constructor(page: PageDto) {
    this.components = page.components.map((component) =>
      component.key === 'a'
        ? new Link(component.href, component.text)
        : new Paragraph(component.text)
    )
    this.title = page.title
    this.path = page.path
  }
}
