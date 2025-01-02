import { test, expect } from 'bun:test'
import App, { type Config } from '@latechforce/engine'
import { drivers } from '@latechforce/engine/bun'

test('should throw an error if config is empty', async () => {
  // GIVEN
  const config = {}
  const app = new App()

  // WHEN
  const call = () => app.start(config)

  // THEN
  expect(call()).rejects.toThrowError("must have required property 'name'")
})

test('should start an app', async () => {
  // GIVEN
  const config: Config = {
    name: 'App',
  }
  const app = new App({ drivers })

  // WHEN
  const { url } = await app.start(config)
  const response = await fetch(url + '/health').then((res) => res.json())

  // THEN
  expect(response.success).toBe(true)
})
