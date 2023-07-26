import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { Component } from '@domain/entities/Component'
import { List } from '@domain/entities/components/List'
import { Navigation } from '@domain/entities/components/Navigation'
import { RenderPageList } from './RenderPageList'
import { RenderPageNavigation } from './RenderPageNavigation'

export class RenderPageComponent {
  constructor(private pageRepository: PageRepository) {}

  execute(component: Component): () => JSX.Element {
    if (component instanceof Navigation) {
      const renderPageNavigation = new RenderPageNavigation(this.pageRepository)
      return renderPageNavigation.execute(component)
    }
    if (component instanceof List) {
      const renderPageList = new RenderPageList(this.pageRepository)
      return renderPageList.execute(component)
    }
    return component.renderUI()
  }
}
