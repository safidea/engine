import { ConfigUtils, PathUtils, RequestBodyInterface } from 'server-common'
import { DatabaseConfig, DatabaseService } from 'server-database'
import { TableConfig, TableRoute } from 'server-table'
import { ComponentConfig } from 'server-component'
import { PageConfig } from 'server-page'

import type { RequestInterface, ResponseInterface } from 'server-common'
import type {
  DatabaseProviderInterface,
  DatabaseProviderConstructorInterface,
} from 'server-database'

class AppServer {
  private configUtils: ConfigUtils
  private databaseProvider: DatabaseProviderInterface

  constructor({
    path,
    DatabaseProvider,
  }: {
    path: string
    DatabaseProvider: DatabaseProviderConstructorInterface
  }) {
    const pathUtils = new PathUtils({ path })
    this.configUtils = new ConfigUtils({ pathUtils })
    const appName = this.configUtils.get('name') as string
    const appVersion = this.configUtils.get('version') as string
    this.databaseProvider = new DatabaseProvider({
      appName,
      appVersion,
    })
  }

  public async execConfig(): Promise<void> {
    const databaseConfig = new DatabaseConfig({
      databaseProvider: this.databaseProvider,
      configUtils: this.configUtils,
    })
    const tableConfig = new TableConfig({
      databaseProvider: this.databaseProvider,
      configUtils: this.configUtils,
    })
    const componentConfig = new ComponentConfig({ configUtils: this.configUtils })
    const pageConfig = new PageConfig({ configUtils: this.configUtils })
    return this.configUtils.exec(databaseConfig, tableConfig, componentConfig, pageConfig)
  }

  public async apiHandler(request: RequestInterface): Promise<ResponseInterface> {
    const databaseService = new DatabaseService({ databaseProvider: this.databaseProvider })
    const tableRoute = new TableRoute({ databaseService, configUtils: this.configUtils })
    const api = request.url.match(/(?<=api\/)[a-z]+(?=\/)/)?.[0]
    try {
      switch (api) {
        case 'table':
          switch (request.method) {
            case 'GET':
              return tableRoute.get(request)
            case 'POST':
              return tableRoute.post(request as RequestBodyInterface)
            case 'PUT':
              return tableRoute.put(request as RequestBodyInterface)
            case 'PATCH':
              return tableRoute.patch(request as RequestBodyInterface)
            default:
              return { status: 405, json: { error: 'Method not allowed' } }
          }
        default:
          return { status: 404, json: { error: 'Not found' } }
      }
    } catch (error) {
      const { status, errors = [] } = error.data
      return { status, json: { error: error.message, details: errors } }
    }
  }

  public getConfigFromPath(path?: string) {
    return this.configUtils.get(path)
  }
}

export default AppServer
