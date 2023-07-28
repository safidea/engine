import React from 'react'
import { PageGateway } from '@adapter/spi/gateways/PageGateway'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { RenderPageComponent } from './RenderPageComponent'

export class RenderPageNavigation {
  private renderPageComponent: RenderPageComponent

  constructor(pageGateway: PageGateway) {
    this.renderPageComponent = new RenderPageComponent(pageGateway)
  }

  execute(navigation: Navigation): () => JSX.Element {
    const UI = navigation.renderUI()
    const TitleComponent = navigation.title.renderUI()
    const LinksComponent = navigation.links.map((link) => link.renderUI())
    const Components = navigation.components.map((component) =>
      this.renderPageComponent.execute(component)
    )
    return function Component() {
      return (
        <UI
          TitleComponent={TitleComponent}
          LinksComponent={LinksComponent}
          Components={Components}
        />
      )
    }
  }
}
