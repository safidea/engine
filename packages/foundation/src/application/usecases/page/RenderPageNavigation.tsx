import React from 'react'
import { FetcherGateway } from '@adapter/spi/gateways/FetcherGateway'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { RenderPageComponent } from './RenderPageComponent'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'
import { Context } from '@domain/entities/page/Context'

export class RenderPageNavigation {
  private renderPageComponent: RenderPageComponent

  constructor(fetcherGateway: FetcherGateway, appGateway: AppGateway) {
    this.renderPageComponent = new RenderPageComponent(fetcherGateway, appGateway)
  }

  async execute(navigation: Navigation, context: Context): Promise<() => JSX.Element> {
    const UI = navigation.renderUI()
    const TitleComponent = navigation.title.renderUI()
    const LinksComponent = navigation.links.map((link) => link.renderUI())
    const Components = await Promise.all(
      navigation.components.map((component) => this.renderPageComponent.execute(component, context))
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
