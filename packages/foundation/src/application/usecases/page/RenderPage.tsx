import { PageGateway } from '@adapter/spi/gateways/PageGateway'
import { Page } from '@domain/entities/page/Page'
import { RenderPageComponent } from './RenderPageComponent'

export class RenderPage {
  private renderPageComponent: RenderPageComponent

  constructor(PageGateway: PageGateway) {
    this.renderPageComponent = new RenderPageComponent(PageGateway)
  }

  execute(page: Page): JSX.Element {
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
