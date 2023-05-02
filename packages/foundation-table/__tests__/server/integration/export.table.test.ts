import { TableRoute, TableService, TableUtils } from '@table/server'

describe('export', () => {
  it('should export TableRoute', () => {
    expect(TableRoute).toBeDefined()
  })

  it('should export TableService', () => {
    expect(TableService).toBeDefined()
  })

  it('should export TableUtils', () => {
    expect(TableUtils).toBeDefined()
  })
})
