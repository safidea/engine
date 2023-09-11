import React from 'react'
import { Navigation } from '@entities/app/page/components/Navigation'
import { RenderPageComponent } from './RenderPageComponent'
import { Context } from '@entities/app/page/Context'
import { IFetcherSpi } from '@entities/spi/IFetcherSpi'
import { App } from '@entities/app/App'

export class RenderPageNavigation {
  private renderPageComponent: RenderPageComponent

  constructor(fetcherSpi: IFetcherSpi, app: App) {
    this.renderPageComponent = new RenderPageComponent(fetcherSpi, app)
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
