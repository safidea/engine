import React from 'react'
import { Page } from '@entities/app/page/Page'
import { RenderPageComponent } from './RenderPageComponent'
import { Context } from '@entities/app/page/PageContext'
import { IFetcherSpi } from '@entities/drivers/fetcher/IFetcherSpi'
import { App } from '@entities/app/App'

export class RenderPage {
  private renderPageComponent: RenderPageComponent

  constructor(fetcherSpi: IFetcherSpi, app: App) {
    this.renderPageComponent = new RenderPageComponent(fetcherSpi, app)
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
