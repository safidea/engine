import { PageRepository } from '@adapter/spi/repositories/PageRepository'
import { Page } from '@domain/entities/Page'
import { ReactElement } from 'react'
import { RenderPageComponent } from './RenderPageComponent'

export class RenderPage {
  private renderPageComponent: RenderPageComponent

  constructor(pageRepository: PageRepository) {
    this.renderPageComponent = new RenderPageComponent(pageRepository)
  }

  execute(page: Page): ReactElement {
    const { components } = page
    return (
      <div>
        {components.map((component, index) => {
          const Component = this.renderPageComponent.execute(component)
          return <Component key={index} />
        })}
      </div>
    )
  }
}
