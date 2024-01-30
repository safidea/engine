import type { IServerInstance } from '@domain/drivers/server/IServer'
import type { EngineError } from '../EngineError'
import type { IEntity } from '../IEntity'
import { FeatureList } from '../feature/FeatureList'
import { RoleList } from '../role/RoleList'
import type { IApp, IAppLayoutPageProps } from './IApp'
import type { IAppParams } from './IAppParams'
import type { ILoggerLog } from '@domain/drivers/ILogger'
import type { IDatabaseInstance } from '@domain/drivers/IDatabase'
import { TextServerResponse } from '@domain/drivers/server/response/text'
import { TableList } from '../table/TableList'
import { PageList } from '../page/PageList'

export class App implements IEntity {
  name: string
  private timestamp: number = +new Date()
  private roles: RoleList
  private features: FeatureList
  private server: IServerInstance
  private log: ILoggerLog
  public database?: IDatabaseInstance
  private tables?: TableList
  private pages?: PageList

  constructor(
    private config: IApp,
    private params: IAppParams
  ) {
    const { drivers, components, port, services } = params
    const { server, logger, database } = drivers
    this.name = config.name
    this.server = server.create(port)
    this.log = logger.init('app:' + logger.slug(this.name))
    this.roles = new RoleList(config.roles ?? [])
    // TODO: should instantiate features only for testing
    // TODO: should merge tables and pages directly
    this.features = new FeatureList(config.features, {
      roles: this.roles,
      components,
      drivers,
      layoutPage: this.layoutPage,
      services,
    })
    if (this.features.hasTables()) {
      const tables = this.features.mergeTables()
      this.database = database.create(tables)
      this.tables = new TableList(tables, {
        drivers,
        serverInstance: this.server,
        databaseInstance: this.database,
        featureName: this.name,
        services,
      })
    }
    if (this.features.hasPages()) {
      const pages = this.features.mergePages()
      this.pages = new PageList(pages, {
        drivers,
        components,
        serverInstance: this.server,
        featureName: this.name,
      })
    }
    this.server.notFound(this.notFoundPage)
    this.log(`404 mounted`)
    process.on('SIGTERM', () => this.onClose('SIGTERM'))
    process.on('SIGINT', () => this.onClose('SIGINT'))
  }

  validateConfig() {
    const errors: EngineError[] = []
    errors.push(...this.roles.validateConfig())
    errors.push(...this.features.validateConfig())
    return errors
  }

  layoutPage = ({ children, ...props }: IAppLayoutPageProps) => {
    const { components } = this.params
    const { title, metas = [], scripts = [], links = [] } = this.config.pages ?? {}
    if (props.metas) metas.push(...props.metas)
    scripts.forEach((script) => {
      script.src += `?ts=${this.timestamp}`
    })
    if (props.scripts) scripts.push(...props.scripts)
    links.unshift({ href: '/output.css' })
    if (props.links) links.push(...props.links)
    links.forEach((link) => {
      link.href += `?ts=${this.timestamp}`
    })
    return (
      <components.Page title={props.title ?? title} metas={metas} scripts={scripts} links={links}>
        {children}
      </components.Page>
    )
  }

  notFoundPage = async (): Promise<TextServerResponse> => {
    const {
      components: { NotFound },
      drivers: { ui },
    } = this.params
    const {
      title = "Something's missing.",
      description = "Sorry, we can't find that page. You'll find lots to explore on the home page.",
      primaryButton,
    } = this.config.pages?.notFound ?? {}
    const { label = 'Back to Homepage', href = '/' } = primaryButton ?? {}
    const Layout = this.layoutPage
    const Page = (
      <Layout title="404 not found">
        <NotFound title={title} description={description} primaryButton={{ label, href }} />
      </Layout>
    )
    const html = ui.render(Page)
    this.log('GET 404')
    return new TextServerResponse(html)
  }

  async testFeaturesSpecs() {
    return this.features.testSpecs()
  }

  async migrateDatabase() {
    return this.database?.migrate()
  }

  async start(): Promise<string> {
    this.log(`starting server...`)
    await this.database?.migrate()
    const url = await this.server.start()
    this.log(`server started at ${url}`)
    return url
  }

  async stop(): Promise<void> {
    this.log(`stopping server...`)
    await this.server.stop(async () => {
      await this.database?.disconnect()
    })
    this.log(`server stopped`)
  }

  isRunning(): boolean {
    return this.server.isListening()
  }

  private onClose = async (signal: 'SIGTERM' | 'SIGINT') => {
    this.log(`received ${signal}. Closing server...`)
    await this.server.stop()
  }
}
