import type { IServerInstance } from '@domain/drivers/IServer'
import type { EngineError } from '../EngineError'
import type { IEntity } from '../IEntity'
import { PageList } from '../page/PageList'
import { SpecList } from '../spec/SpecList'
import { FeatureError } from './FeatureError'
import type { IFeature } from './IFeature'
import type { IFeatureParams } from './IFeatureParams'
import type { SpecError } from '../spec/SpecError'
import type { ILoggerLog } from '@domain/drivers/ILogger'
import { TableList } from '../table/TableList'

export class Feature implements IEntity {
  name: string
  private specs: SpecList
  private pages: PageList
  private tables: TableList
  private server: IServerInstance
  private log: ILoggerLog

  constructor(
    private config: IFeature,
    private params: IFeatureParams
  ) {
    const { drivers, components, serverInstance, layoutPage } = params
    const { server, logger } = drivers
    this.name = config.name
    this.server = serverInstance ?? server.create()
    this.log = logger.init('feature:' + logger.slug(this.name))
    this.specs = new SpecList(config.specs ?? [], { drivers, featureName: this.name })
    this.pages = new PageList(config.pages ?? [], {
      components,
      serverInstance: this.server,
      drivers,
      featureName: this.name,
      layoutPage,
    })
    this.tables = new TableList(config.tables ?? [], {
      drivers,
      featureName: this.name,
    })
  }

  validateConfig() {
    const errors: EngineError[] = []
    const { roles } = this.params
    const { role } = this.config
    if (role && !roles.includes(role)) {
      errors.push(
        new FeatureError('ROLE_NOT_FOUND', {
          feature: this.config.name,
          role,
        })
      )
    }
    errors.push(...this.specs.validateConfig())
    errors.push(...this.pages.validateConfig())
    errors.push(...this.tables.validateConfig())
    return errors
  }

  async testSpecs(): Promise<SpecError[]> {
    const url = await this.server.start()
    this.log(`server started at ${url}`)
    const errors = await this.specs.test(url)
    await this.server.stop()
    this.log(`server stopped`)
    return errors
  }

  hasTables() {
    return this.tables.length > 0
  }

  getTables() {
    return this.tables.all
  }
}
