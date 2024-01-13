import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { TitleComponent } from '../title/TitleComponent'
import { NavigationComponentParams } from './NavigationComponentParams'
import { PageConfig } from '../../Page'
import { NavigationComponentUI } from './NavigationComponentUI'
import { LinkComponent } from '../link/LinkComponent'
import { Component, newComponent } from '../Component'
import { Context } from '../../context/Context'
import { PageServices } from '../../PageServices'

export class NavigationComponent extends BaseComponent {
  readonly title: TitleComponent
  readonly links: LinkComponent[]
  readonly components: Component[]

  constructor(
    readonly params: NavigationComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    const { title, links, components } = params
    super(params, services, config)
    this.title = new TitleComponent(title, services, config)
    this.links = links.map((link) => new LinkComponent(link, services, config))
    this.components = components.map((component) => newComponent(component, services, config))
  }

  async render(context: Context) {
    const Title = await this.title.render()
    const Links = await Promise.all(this.links.map((link) => link.render()))
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => (
      <NavigationComponentUI
        ui={this.services.ui}
        Title={Title}
        Links={Links}
        Components={Components}
        testId={this.params.testId}
        style={this.params.style}
      />
    )
  }
}
