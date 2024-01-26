import type { ILoggerLog } from '@domain/drivers/ILogger'
import type { IEntity } from '../IEntity'
import type { IPage } from './IPage'
import type { IPageParams } from './IPageParams'

export class Page implements IEntity {
  name: string
  private timestamp: number = +new Date()
  private log: ILoggerLog

  constructor(
    private config: IPage,
    private params: IPageParams
  ) {
    const { server, drivers, featureName } = params
    const { logger } = drivers
    this.name = config.name
    this.log = logger.init(`feature:${logger.slug(featureName)}:page:${logger.slug(this.name)}`)
    server.get(config.path, this.get)
    this.log(`GET mounted on ${config.path}`)
  }

  get = async () => {
    this.log('GET ' + this.config.path)
    return { html: this.renderHtml() }
  }

  renderComponent = () => {
    const { components } = this.params
    const { body, title, metas = [], scripts = [], links = [] } = this.config
    scripts.forEach((script) => {
      script.src += `?ts=${this.timestamp}`
    })
    links.unshift({ href: '/output.css' })
    links.forEach((link) => {
      link.href += `?ts=${this.timestamp}`
    })
    return (
      <components.Page title={title} metas={metas} scripts={scripts} links={links}>
        {body.map((props, index) => {
          const { component } = props
          if (component === 'Paragraph') {
            return <components.Paragraph key={index} {...props} />
          } else if (component === 'Hero') {
            return <components.Hero key={index} {...props} />
          } else if (component === 'Logos') {
            return <components.Logos key={index} {...props} />
          } else if (component === 'Features') {
            return <components.Features key={index} {...props} />
          } else if (component === 'Button') {
            return <components.Button key={index} {...props} />
          } else if (component === 'CTA') {
            return <components.CTA key={index} {...props} />
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
