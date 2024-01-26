import type { ILoggerLog } from '@domain/drivers/ILogger'
import type { IEntity } from '../IEntity'
import type { IPage } from './IPage'
import type { IPageParams } from './IPageParams'

export class Page implements IEntity {
  name: string
  private log: ILoggerLog

  constructor(
    private config: IPage,
    private params: IPageParams
  ) {
    const { serverInstance, drivers, featureName } = params
    const { logger } = drivers
    this.name = config.name
    this.log = logger.init(`feature:${logger.slug(featureName)}:page:${logger.slug(this.name)}`)
    serverInstance.get(config.path, this.get)
    this.log(`GET mounted on ${config.path}`)
  }

  get = async () => {
    this.log('GET ' + this.config.path)
    return { html: this.renderHtml() }
  }

  renderPage = ({ children }: { children: React.ReactNode }) => {
    const { components, timestamp, layoutPage } = this.params
    const { title, metas = [], scripts = [], links = [] } = this.config
    scripts.forEach((script) => {
      script.src += `?ts=${timestamp}`
    })
    links.unshift({ href: '/output.css' })
    links.forEach((link) => {
      link.href += `?ts=${timestamp}`
    })
    const Page = layoutPage ?? components.Page
    return (
      <Page title={title} metas={metas} scripts={scripts} links={links}>
        {children}
      </Page>
    )
  }

  renderComponent = () => {
    const { components, layoutPage } = this.params
    const { body } = this.config
    const Page = layoutPage ?? this.renderPage
    return (
      <Page>
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
          } else if (component === 'Footer') {
            return <components.Footer key={index} {...props} />
          }
        })}
      </Page>
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
