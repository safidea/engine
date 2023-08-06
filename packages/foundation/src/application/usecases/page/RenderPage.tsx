import React from 'react'
import { Page } from '@domain/entities/page/Page'
import { RenderPageComponent } from './RenderPageComponent'
import { Context } from '@domain/entities/page/Context'
import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'

export class RenderPage {
  private renderPageComponent: RenderPageComponent

  constructor(fetcherGateway: FetcherGatewayAbstract) {
    this.renderPageComponent = new RenderPageComponent(fetcherGateway)
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
