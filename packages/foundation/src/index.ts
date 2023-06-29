import './env'
import { ApiError, ConfigUtils, PathUtils } from 'server-common'
import { DatabaseService } from 'server-database'
import { TableRoute } from 'server-table'
import { getOrmProvider } from './utils'
import { PageComponent, PageComponentProps } from 'client-page'

import type {
  AppConfig,
  RequestInterface,
  ResponseInterface,
  RequestBodyInterface,
} from 'shared-app'
import type { OrmProviderInterface, OrmProviderTablesInterface } from 'server-database'
import type { AppProviderComponentsInterface, ObjectValueInterface } from 'shared-common'

type FoundationProps = {
  orm?: OrmProviderTablesInterface
  components?: AppProviderComponentsInterface
}

class Foundation {
  private configUtils: ConfigUtils
  private orm?: OrmProviderTablesInterface
  private ormProvider?: OrmProviderInterface
  private components?: AppProviderComponentsInterface

  constructor(props?: FoundationProps) {
    const { orm, components } = props || {}
    const pathUtils = new PathUtils()
    this.configUtils = new ConfigUtils({ pathUtils, fromCache: true })
    const {
      version: appVersion,
      name: appName,
      database,
      pages,
    } = this.configUtils.get() as AppConfig
    if (database) {
      this.orm = orm
      this.ormProvider = getOrmProvider({ appVersion, appName, database })
    }
    if (pages) this.components = components
  }

  public page({ path, ...props }: JSX.IntrinsicAttributes & { path: string }) {
    const page = this.configUtils.get('pages.' + path)
    return PageComponent({ ...props, appProviderComponents: this.components, page })
  }

  public async api(request: RequestInterface): Promise<ResponseInterface> {
    try {
      if (!this.orm || !this.ormProvider) throw new Error('Database not found')
      const databaseService = new DatabaseService({ orm: this.orm, ormProvider: this.ormProvider })
      const tableRoute = new TableRoute({ databaseService, configUtils: this.configUtils })
      const api = request.url.match(/(?<=api\/)[a-z]+(?=\/)/)?.[0]
      request.local = {}
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
            case 'DELETE':
              return await tableRoute.delete(request as RequestBodyInterface)
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
      console.error(error)
      return { status: 500, json: { error: 'Internal server error' } }
    }
  }
}

export default Foundation
