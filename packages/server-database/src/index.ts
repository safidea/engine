import { AppUtils } from 'server-common'
import * as Apps from './apps'

AppUtils.register(Apps, 'server-database')

export * from 'shared-database'

export { default as DatabaseConfig } from './configs/database.config'
export { default as DatabaseService } from './services/database.service'
