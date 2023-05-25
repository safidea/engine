import { AppUtils } from 'server-common'
import * as App from './app'
import DatabaseService from './services/database.service'
import DatabaseConfig from './configs/database.config'

AppUtils.registerLibraries(App, 'server-database')
DatabaseService.initLibraries()

export * from 'shared-database'
export { DatabaseService, DatabaseConfig }
