import type { IServerInstance } from '@domain/drivers/server/IServer'
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
import type { IDatabaseInstance } from '@domain/drivers/IDatabase'

export class Feature implements IEntity {
  name: string
  private specs: SpecList
  private pages?: PageList
  private tables?: TableList
  private server: IServerInstance
  private database?: IDatabaseInstance
  private log: ILoggerLog

  constructor(
    private config: IFeature,
    private params: IFeatureParams
  ) {
    const { drivers, components, serverInstance, layoutPage, services } = params
    const { server, database, logger } = drivers
    const { pages, tables, name } = config
    this.name = name
    this.server = serverInstance ?? server.create()
    this.log = logger.init('feature:' + logger.slug(this.name))
    if (tables && tables.length > 0) {
      this.database = database.create(tables)
      this.tables = new TableList(tables ?? [], {
        drivers,
        featureName: this.name,
        serverInstance: this.server,
        databaseInstance: this.database,
        services,
      })
    }
    // TODO: specs instanciation should be optional
    this.specs = new SpecList(config.specs ?? [], {
      drivers,
      featureName: this.name,
      databaseInstance: this.database,
    })
    if (pages && pages.length > 0) {
      this.pages = new PageList(config.pages ?? [], {
        components,
        serverInstance: this.server,
        drivers,
        featureName: this.name,
        layoutPage,
      })
    }
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
    if (this.pages) errors.push(...this.pages.validateConfig())
    if (this.tables) errors.push(...this.tables.validateConfig())
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
    return !!this.tables
  }

  hasPages() {
    return !!this.pages
  }

  getTables() {
    return this.config.tables ?? []
  }

  getPages() {
    return this.config.pages ?? []
  }
}
