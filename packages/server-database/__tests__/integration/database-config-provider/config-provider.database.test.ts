import './setup'
import { DatabaseConfig } from '../../../src'
import PrismaUtils from '../../../src/utils/prisma.utils'
import { ConfigUtils } from 'server-common'

describe('config app with databases', () => {
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
  })
})
