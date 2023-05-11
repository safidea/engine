import DatabaseConfig from '@database/server/configs/database.config'
import PrismaUtils from '@database/server/utils/prisma.utils'
import { ConfigUtils, AppUtils } from '@common/server'
import { TestUtils } from '@test/server'

jest.unmock('fs-extra')

let baseId = ''
let noConfigId = ''
let notValidSchemaId = ''

beforeAll(async () => {
  const res = await Promise.all([
    TestUtils.createTestApp('base'),
    TestUtils.createTestApp('no-config'),
    TestUtils.createTestApp('not-valid-schema'),
  ])
  baseId = res[0]
  noConfigId = res[1]
  notValidSchemaId = res[2]
})

afterAll(async () => {
  await Promise.all([
    TestUtils.destroyTestApp(baseId),
    TestUtils.destroyTestApp(noConfigId),
    TestUtils.destroyTestApp(notValidSchemaId),
  ])
})

describe('app with no databases', () => {
  beforeAll(() => {
    TestUtils.loadEnvFile(noConfigId)
    ConfigUtils.init()
  })

  it('should enrich config with default schema', () => {
    DatabaseConfig.enrich()
    const databases = ConfigUtils.get('databases') as any
    expect(databases.master).toBeDefined()
  })

  it('should validate config', () => {
    DatabaseConfig.validate()
  })

  it('should load lib config', () => {
    DatabaseConfig.lib()
  })

  it('should build js config', () => {
    const tasks = {
      database: 'master',
      fields: {
        id: {
          type: 'Int',
          primary: true,
          unique: true,
        },
      },
    }
    PrismaUtils.updateModelSchema('master', 'Task', tasks)
    DatabaseConfig.js()
    AppUtils.removeAllImports()
  })
})

describe('app with not valid databases schema', () => {
  beforeAll(() => {
    TestUtils.loadEnvFile(notValidSchemaId)
    ConfigUtils.init()
  })

  it('should enrich config', () => {
    DatabaseConfig.enrich()
  })

  it('should invalidate config', () => {
    try {
      DatabaseConfig.validate()
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toContain("must have required property 'url'")
    }
  })
})

describe('app with databases', () => {
  beforeAll(() => {
    TestUtils.loadEnvFile(baseId)
    ConfigUtils.init()
  })

  it('should enrich config', () => {
    DatabaseConfig.enrich()
  })

  it('should validate config', () => {
    DatabaseConfig.validate()
  })

  it('should load lib config', () => {
    DatabaseConfig.lib()
  })

  it('should build js config', () => {
    const tasks = ConfigUtils.get('tables.tasks') as any
    PrismaUtils.updateModelSchema('main', tasks.model, tasks)
    DatabaseConfig.js()
    AppUtils.removeAllImports()
  })
})
