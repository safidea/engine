import { ApiError, ConfigUtils, PathUtils } from 'server-common'
import { DatabaseConfig, DatabaseService } from 'server-database'
import { TableConfig, TableRoute } from 'server-table'
import { ComponentConfig } from 'server-component'
import { PageConfig } from 'server-page'

import type { RequestInterface, RequestBodyInterface, ResponseInterface } from 'shared-app'
import type {
  DatabaseProviderInterface,
  DatabaseProviderConstructorInterface,
} from 'server-database'

export type AppServerProps = {
  path: string
  DatabaseProvider: DatabaseProviderConstructorInterface
}

class AppServer {
  private configUtils: ConfigUtils
  private databaseProvider: DatabaseProviderInterface

  constructor({ path, DatabaseProvider }: AppServerProps) {
    const pathUtils = new PathUtils({ path })
    this.configUtils = new ConfigUtils({ pathUtils })
    this.configUtils.init()
    const appName = this.configUtils.get('name') as string
    const appVersion = this.configUtils.get('version') as string
    this.databaseProvider = new DatabaseProvider({ appName, appVersion })
  }

  public async execConfig(): Promise<void> {
    const configUtils = this.configUtils
    const databaseProvider = this.databaseProvider
    const databaseConfig = new DatabaseConfig({ databaseProvider, configUtils })
    const tableConfig = new TableConfig({ databaseProvider, configUtils })
    const componentConfig = new ComponentConfig({ configUtils })
    const pageConfig = new PageConfig({ configUtils })
    const isUpdated = await configUtils.exec([
      databaseConfig,
      tableConfig,
      componentConfig,
      pageConfig,
    ])
    if (isUpdated) configUtils.cache()
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
              return await tableRoute.get(request)
            case 'POST':
              return await tableRoute.post(request as RequestBodyInterface)
            case 'PUT':
              return await tableRoute.put(request as RequestBodyInterface)
            case 'PATCH':
              return await tableRoute.patch(request as RequestBodyInterface)
            default:
              return { status: 405, json: { error: 'Method not allowed' } }
          }
        default:
          return { status: 404, json: { error: 'Not found' } }
      }
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const { status, errors = [] } = error.data
        return { status, json: { error: error.message, details: errors.join('\n') } }
      }
      return { status: 500, json: { error: 'Internal server error' } }
    }
  }

  public getConfigFromPath(path?: string) {
    return this.configUtils.get(path)
  }
}

export default AppServer
