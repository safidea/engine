import { SchemaUtils, PathUtils, RouteUtils, ConfigUtils } from '@common/server'

describe('export', () => {
  it('should export SchemaUtils', () => {
    expect(SchemaUtils).toBeDefined()
  })
  it('should export PathUtils', () => {
    expect(PathUtils).toBeDefined()
  })
  it('should export RouteUtils', () => {
    expect(RouteUtils).toBeDefined()
  })
  it('should export ConfigUtils', () => {
    expect(ConfigUtils).toBeDefined()
  })
})
