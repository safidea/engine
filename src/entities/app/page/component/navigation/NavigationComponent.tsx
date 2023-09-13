import React from 'react'
import { BaseComponent } from '../base/BaseComponent'
import { TitleComponent } from '../title/TitleComponent'
import { NavigationComponentOptions } from './NavigationComponentOptions'
import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '../../Page'
import { NavigationComponentUI } from './NavigationComponentUI'
import { LinkComponent } from '../link/LinkComponent'
import { Component, newComponent } from '../Component'
import { PageContext } from '../../PageContext'

export class NavigationComponent extends BaseComponent {
  readonly title: TitleComponent
  readonly links: LinkComponent[]
  readonly components: Component[]

  constructor(options: NavigationComponentOptions, drivers: AppDrivers, config: PageConfig) {
    const { type, title, links, components } = options
    super({ type }, drivers, config)
    this.title = new TitleComponent(title, drivers, config)
    this.links = links.map((link) => new LinkComponent(link, drivers, config))
    this.components = components.map((component) => newComponent(component, drivers, config))
  }

  async render(context: PageContext) {
    const Title = await this.title.render()
    const Links = await Promise.all(this.links.map((link) => link.render()))
    const Components = await Promise.all(
      this.components.map((component) => component.render(context))
    )
    return () => (
      <NavigationComponentUI
        ui={this.drivers.ui}
        Title={Title}
        Links={Links}
        Components={Components}
      />
    )
  }
}
