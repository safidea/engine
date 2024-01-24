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
    const {
      components,
      drivers: { ui },
    } = this.params
    const html = ui.render(
      <>
        {this.config.body.map(({ component: name, ...props }, index) => {
          const Component = components[name]
          return <Component key={index} {...props} />
        })}
      </>
    )
    const cleanedHtml = html.replace(/<!--.*?-->/gs, '')
    return { html: cleanedHtml }
  }

  validateConfig() {
    return []
  }
}
