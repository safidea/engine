import React from 'react'
import { FetcherGateway } from '@adapter/spi/gateways/FetcherGateway'
import { Page } from '@domain/entities/page/Page'
import { RenderPageComponent } from './RenderPageComponent'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'
import { Context } from '@domain/entities/page/Context'

export class RenderPage {
  private renderPageComponent: RenderPageComponent

  constructor(fetcherGateway: FetcherGateway, appGateway: AppGateway) {
    this.renderPageComponent = new RenderPageComponent(fetcherGateway, appGateway)
  }

  async execute(page: Page, context: Context): Promise<() => JSX.Element> {
    const { components } = page
    const Components = await Promise.all(
      components.map((component) => this.renderPageComponent.execute(component, context))
    )
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
