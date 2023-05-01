import { SchemaUtils, PathUtils, RouterUtils, ConfigUtils } from '@common/server'

describe('export', () => {
  it('should export SchemaUtils', () => {
    expect(SchemaUtils).toBeDefined()
  })
  it('should export PathUtils', () => {
    expect(PathUtils).toBeDefined()
  })
  it('should export RouterUtils', () => {
    expect(RouterUtils).toBeDefined()
  })
  it('should export ConfigUtils', () => {
    expect(ConfigUtils).toBeDefined()
  })
})
