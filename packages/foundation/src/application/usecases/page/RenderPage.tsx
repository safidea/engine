import React from 'react'
import { PageGateway } from '@adapter/spi/gateways/PageGateway'
import { Page } from '@domain/entities/page/Page'
import { RenderPageComponent } from './RenderPageComponent'

export class RenderPage {
  private renderPageComponent: RenderPageComponent

  constructor(pageGateway: PageGateway) {
    this.renderPageComponent = new RenderPageComponent(pageGateway)
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
