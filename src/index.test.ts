import { test, expect } from 'bun:test'

test('should export packages', async () => {
  const { packages } = await import('./index')
  expect(packages).toBeDefined()
})

test('should export NotionTablePage', async () => {
  const { NotionTablePage } = await import('./index')
  expect(NotionTablePage).toBeDefined()
})

test('should export DatabaseTableRecord', async () => {
  const { DatabaseTableRecord } = await import('./index')
  expect(DatabaseTableRecord).toBeDefined()
})
