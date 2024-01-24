import type { IEntity } from '../IEntity'
import type { IPage } from './IPage'
import type { IPageParams } from './IPageParams'

export class Page implements IEntity {
  name: string

  constructor(
    private config: IPage,
    private params: IPageParams
  ) {
    this.name = config.name
    const { server } = params
    server.get(config.path, this.get)
  }

  get = async () => {
    return { html: this.renderHtml() }
  }

  renderComponent = () => {
    const { components } = this.params
    const { body } = this.config
    return (
      <>
        {body.map(({ component: name, ...props }, index) => {
          const Component = components[name]
          return <Component key={index} {...props} />
        })}
      </>
    )
  }

  renderHtml = () => {
    const { ui } = this.params.drivers
    const html = ui.render(this.renderComponent())
    const cleanedHtml = html.replace(/<!--.*?-->/gs, '')
    return cleanedHtml
  }

  validateConfig() {
    return []
  }
}
