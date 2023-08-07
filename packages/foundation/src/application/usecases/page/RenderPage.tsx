import React from 'react'
import { Page } from '@domain/entities/page/Page'
import { RenderPageComponent } from './RenderPageComponent'
import { Context } from '@domain/entities/page/Context'
import { FetcherGatewayAbstract } from '@application/gateways/FetcherGatewayAbstract'
import { App } from '@domain/entities/app/App'

export class RenderPage {
  private renderPageComponent: RenderPageComponent

  constructor(fetcherGateway: FetcherGatewayAbstract, app: App) {
    this.renderPageComponent = new RenderPageComponent(fetcherGateway, app)
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
