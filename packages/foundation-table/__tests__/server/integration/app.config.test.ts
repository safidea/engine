import { TableConfig } from '@table/config'
import { ConfigUtils } from '@common/server'
import { TestUtils } from '@test/server'

jest.unmock('fs-extra')

let baseId = ''
let notValidSchemaId = ''

beforeAll(async () => {
  const res = await Promise.all([
    TestUtils.createTestApp('base'),
    TestUtils.createTestApp('no-config'),
    TestUtils.createTestApp('not-valid-schema'),
  ])
  baseId = res[0]
  notValidSchemaId = res[2]
})

afterAll(async () => {
  await Promise.all([TestUtils.destroyTestApp(baseId), TestUtils.destroyTestApp(notValidSchemaId)])
})

describe('app with not valid tables schema', () => {
  beforeAll(() => {
    TestUtils.loadEnvFile(notValidSchemaId)
    ConfigUtils.init()
  })

  it('should enrich config', () => {
    TableConfig.enrich()
  })

  it('should invalidate config', () => {
    try {
      TableConfig.validate()
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.message).toContain("must have required property 'database'")
    }
  })
})

describe('app with tables', () => {
  beforeAll(() => {
    TestUtils.loadEnvFile(baseId)
    ConfigUtils.init()
  })

  it('should enrich config', () => {
    TableConfig.enrich()
  })

  it('should validate config', () => {
    TableConfig.validate()
  })

  it('should load lib config', () => {
    TableConfig.lib()
  })
})
