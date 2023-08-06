import React from 'react'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { RenderPageComponent } from './RenderPageComponent'
import { Context } from '@domain/entities/page/Context'
import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'

export class RenderPageNavigation {
  private renderPageComponent: RenderPageComponent

  constructor(fetcherGateway: FetcherGatewayAbstract) {
    this.renderPageComponent = new RenderPageComponent(fetcherGateway)
  }

  async execute(navigation: Navigation, context: Context): Promise<() => JSX.Element> {
    const UI = navigation.renderUI()
    const TitleComponent = navigation.title.renderUI()
    const LinksComponent = navigation.links.map((link) => link.renderUI())
    const Components = await Promise.all(
      navigation.components.map((component) => this.renderPageComponent.execute(component, context))
    )
    return function NavigationComponent() {
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
