import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { Navigation } from '@domain/entities/components/Navigation'
import { RenderPageComponent } from './RenderPageComponent'

export class RenderPageNavigation {
  private renderPageComponent: RenderPageComponent

  constructor(pageRepository: PageRepository) {
    this.renderPageComponent = new RenderPageComponent(pageRepository)
  }

  execute(navigation: Navigation): () => JSX.Element {
    const UI = navigation.renderUI()
    const TitleComponent = navigation.title.renderUI()
    const LinksComponent = navigation.links.map((link) => link.renderUI())
    const Components = navigation.components.map((component) =>
      this.renderPageComponent.execute(component)
    )
    return function Component() {
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
