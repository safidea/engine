import './setup'
import { DatabaseConfig } from '../../../src'
import PrismaUtils from '../../../src/utils/prisma.utils'
import { ConfigUtils } from 'server-common'

describe('config app with no databases', () => {
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
  })
})
