import { AppUtils } from 'server-common'
import * as Apps from './apps'
import DatabaseService from './services/database.service'
import DatabaseConfig from './configs/database.config'

AppUtils.register(Apps, 'server-database')
DatabaseService.initLibraries()

export * from 'shared-database'
export { DatabaseService, DatabaseConfig }
