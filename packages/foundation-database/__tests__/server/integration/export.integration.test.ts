process.env.APP_NAME = 'base'
import { PrismaLib, PrismaUtils, DatabaseUtils, DatabaseService } from '@database/server'

jest.mock('@common/server/apps')

describe('exports', () => {
  it('should export PrismaLib', () => {
    expect(PrismaLib).toBeDefined()
  })
  it('should export PrismaUtils', () => {
    expect(PrismaUtils).toBeDefined()
  })
  it('should export DatabaseUtils', () => {
    expect(DatabaseUtils).toBeDefined()
  })
  it('should export DatabaseService', () => {
    expect(DatabaseService).toBeDefined()
  })
})