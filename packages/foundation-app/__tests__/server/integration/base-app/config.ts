import DatabaseConfig from '@database/server/configs/database.config'
import TableConfig from '@table/server/configs/table.config'
import { DatabaseUtils, PrismaLib, PrismaUtils } from '@database/server'
import { ConfigUtils } from '@common/server'
import { TestUtils } from '@test/server'

let baseId = ''

beforeAll(async () => {
  baseId = await TestUtils.createTestApp('base')
  TestUtils.loadEnvFile(baseId)
  ConfigUtils.init()
  TestUtils.configTestApp([DatabaseConfig, TableConfig])
  await PrismaLib.updateClients(PrismaUtils.getClientFolder())
})

afterAll(async () => {
  DatabaseUtils.cleanImport()
  await TestUtils.destroyTestApp(baseId)
})
