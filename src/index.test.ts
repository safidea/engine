import { test, expect } from 'bun:test'

test('should export packages', async () => {
  const { packages } = await import('./index')
  expect(packages).toBeDefined()
})
