import React from 'react'
import { FetcherGateway } from '@adapter/spi/gateways/FetcherGateway'
import { Page } from '@domain/entities/page/Page'
import { RenderPageComponent } from './RenderPageComponent'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'

export class RenderPage {
  private renderPageComponent: RenderPageComponent

  constructor(fetcherGateway: FetcherGateway, appGateway: AppGateway) {
    this.renderPageComponent = new RenderPageComponent(fetcherGateway, appGateway)
  }

  execute(page: Page): () => JSX.Element {
    const { components } = page
    const Components = components.map((component) => this.renderPageComponent.execute(component))
    return function PageComponent() {
      return (
        <div>
          {Components.map((Component, index) => {
            return <Component key={index} />
          })}
        </div>
      )
    }
  }
}
