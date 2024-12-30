import { test, expect } from 'bun:test'
import { drivers, integrations } from './bun'

test('should export drivers', async () => {
  expect(drivers).toBeDefined()
})

test('should export integrations', async () => {
  expect(integrations).toBeDefined()
})
