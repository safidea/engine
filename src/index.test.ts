import { test, expect } from 'bun:test'
import App, { packages } from './index'
import { drivers, integrations } from './bun'

test('should export packages', async () => {
  expect(packages).toBeDefined()
})

test('should instanciate an App', async () => {
  expect(new App()).toBeDefined()
})

test('should instanciate an App with custom drivers', async () => {
  expect(new App({ drivers })).toBeDefined()
})

test('should instanciate an App with custom integrations', async () => {
  expect(new App({ integrations })).toBeDefined()
})
