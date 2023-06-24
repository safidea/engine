import dotenv from 'dotenv'
if (process.env.NODE_ENV === 'test') dotenv.config({ path: '.env.test' })
else dotenv.config()

import PrismaOrmProvider from './providers/orm/prisma.orm.provider'
import NextServerProvider from './providers/server/next.server.provider'
import { ApiError, ConfigUtils, PathUtils } from 'server-common'
//import { DatabaseConfig, DatabaseService } from 'server-database'
/*import { TableConfig, TableRoute } from 'server-table'
import { ComponentConfig } from 'server-component'*/
import { PageConfig } from 'server-page'

import type { ConfigInterface } from 'shared-app'
//import type { OrmProviderInterface } from 'server-database'
import type { ServerProviderInterface, ObjectValueInterface } from 'shared-common'

const { FOUNDATION_SERVER, FOUNDATION_ORM } = process.env

class AppServer {
  private configUtils: ConfigUtils
  //private ormProvider: OrmProviderInterface
  private serverProvider: ServerProviderInterface

  constructor() {
    const pathUtils = new PathUtils()
    this.configUtils = new ConfigUtils({ pathUtils })
    this.configUtils.init()
    /*switch(FOUNDATION_ORM) {
      case 'prisma':
        this.ormProvider = new PrismaOrmProvider()
        break
      default:
        throw new Error('ORM provider not found')
    }*/
    switch (FOUNDATION_SERVER) {
      case 'next':
        this.serverProvider = new NextServerProvider({ configUtils: this.configUtils })
        break
      default:
        throw new Error('Server provider not found')
    }
  }

  public async execConfig({ withCache = false }): Promise<void> {
    const configUtils = this.configUtils
    const serverProvider = this.serverProvider
    const pageConfig = new PageConfig({ configUtils, serverProvider })
    const isUpdated = await configUtils.exec([pageConfig], withCache)
    if (isUpdated) configUtils.cache()
    /*const databaseProvider = this.databaseProvider
    const databaseConfig = new DatabaseConfig({ databaseProvider, configUtils })
    const tableConfig = new TableConfig({ databaseProvider, configUtils })
    const componentConfig = new ComponentConfig({ configUtils })*/
  }

  /*public async apiHandler(request: RequestInterface): Promise<ResponseInterface> {
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
  }*/

  public getConfigFromPath(path?: string): ConfigInterface | ObjectValueInterface {
    return this.configUtils.get(path)
  }
}

export default AppServer
