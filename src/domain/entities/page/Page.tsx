import type { IEntity } from '../IEntity'
import type { IPage } from './IPage'
import type { IPageParams } from './IPageParams'

export class Page implements IEntity {
  name: string
  timestamp: number = +new Date()

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
    const { body, title, metas = [], scripts = [], links = [] } = this.config
    scripts.forEach((script) => {
      script.src += `?ts=${this.timestamp}`
    })
    // TODO: add output.css to the server static files
    links.unshift({ href: '/output.css' })
    links.forEach((link) => {
      link.href += `?ts=${this.timestamp}`
    })
    return (
      <components.Page title={title} metas={metas} scripts={scripts} links={links}>
        {body.map((component, index) => {
          const { component: name } = component
          if (name === 'Paragraph') {
            return <components.Paragraph key={index} {...component} />
          } else if (name === 'Hero') {
            return <components.Hero key={index} {...component} />
          }
        })}
      </components.Page>
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
