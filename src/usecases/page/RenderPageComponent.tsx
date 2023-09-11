import React from 'react'
import { Component } from '@entities/app/page/Component'
import { List } from '@entities/app/page/components/List'
import { Navigation } from '@entities/app/page/components/Navigation'
import { RenderPageList } from './RenderPageList'
import { RenderPageNavigation } from './RenderPageNavigation'
import { RenderPageForm } from './RenderPageForm'
import { Form } from '@entities/app/page/components/Form'
import { Context } from '@entities/app/page/Context'
import { IFetcherSpi } from '@entities/spi/IFetcherSpi'
import { App } from '@entities/app/App'
import { ContainerComponent } from '@entities/app/page/components/ContainerComponent'

export class RenderPageComponent {
  constructor(
    private fetcherSpi: IFetcherSpi,
    private app: App
  ) {}

  async execute(component: Component, context: Context): Promise<() => JSX.Element> {
    if (component instanceof Navigation) {
      const renderPageNavigation = new RenderPageNavigation(this.fetcherSpi, this.app)
      return renderPageNavigation.execute(component, context)
    }
    if (component instanceof List) {
      const renderPageList = new RenderPageList(this.fetcherSpi)
      return renderPageList.execute(component)
    }
    if (component instanceof Form) {
      const renderPageForm = new RenderPageForm(this.fetcherSpi, this.app)
      return renderPageForm.execute(component, context)
    }
    if (component instanceof ContainerComponent) {
      const children = await Promise.all(
        component.components.map(async (component) => this.execute(component, context))
      )
      return component.renderUI(children.map((Child, index) => <Child key={index} />))
    }
    return component.renderUI()
  }
}
