import { PageGateway } from '@adapter/spi/gateways/PageGateway'
import { Component } from '@domain/entities/page/Component'
import { List } from '@domain/entities/page/components/List'
import { Navigation } from '@domain/entities/page/components/Navigation'
import { RenderPageList } from './RenderPageList'
import { RenderPageNavigation } from './RenderPageNavigation'

export class RenderPageComponent {
  constructor(private pageGateway: PageGateway) {}

  execute(component: Component): () => JSX.Element {
    if (component instanceof Navigation) {
      const renderPageNavigation = new RenderPageNavigation(this.pageGateway)
      return renderPageNavigation.execute(component)
    }
    if (component instanceof List) {
      const renderPageList = new RenderPageList(this.pageGateway)
      return renderPageList.execute(component)
    }
    return component.renderUI()
  }
}
