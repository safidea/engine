import DatabaseConfig from '@database/server/configs/database.config'
import PrismaUtils from '@database/server/utils/prisma.utils'
import { ConfigUtils } from '@common/server'

jest.mock('@database/server/utils/prisma.utils')

beforeAll(() => {
  jest.clearAllMocks()
})

describe('enrich', () => {
  it('should not set default databases', () => {
    ConfigUtils.set('databases', { test: true })
    DatabaseConfig.enrich()
    const databases = ConfigUtils.get('databases')
    expect(databases).toEqual({ test: true })
  })

  it('should set default databases', () => {
    ConfigUtils.set('databases', undefined)
    DatabaseConfig.enrich()
    const databases = ConfigUtils.get('databases')
    expect(databases).toBeDefined()
  })
})

describe('validate', () => {
  it('should throw error', () => {
    ConfigUtils.set('databases', { master: 'test' })
    try {
      DatabaseConfig.validate()
    } catch (e: any) {
      expect(e.message).toContain('must be object')
    }
  })

  it('should not throw error', () => {
    ConfigUtils.set('databases', {
      master: {
        provider: 'postgresql',
        url: 'postgres://localhost:5432/test',
      },
    })
    DatabaseConfig.validate()
  })
})

describe('lib', () => {
  it('should update database schema', () => {
    ConfigUtils.set('databases', {
      master: {},
      account: {},
      accounting: {},
    })
    DatabaseConfig.lib()
    expect(PrismaUtils.updateDatabaseSchema).toBeCalledTimes(3)
  })
})

describe('js', () => {
  it('should build prisma clients', () => {
    DatabaseConfig.js()
    expect(PrismaUtils.buildClient).toBeCalledTimes(3)
    expect(PrismaUtils.buildIndexClients).toBeCalledTimes(1)
  })
})
