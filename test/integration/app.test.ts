import { it, expect, describe } from 'bun:test'
import BunApp, { type Config } from '@test/app/bun'

describe('start', () => {
  it('should throw an error if config is empty', async () => {
    // GIVEN
    const config = {}
    const app = new BunApp()

    // WHEN
    const call = () => app.start(config)

    // THEN
    expect(call()).rejects.toThrowError("must have required property 'name'")
  })

  it('should start an app', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
    }
    const app = new BunApp()

    // WHEN
    const { url } = await app.start(config)

    // THEN
    expect(url).toBeDefined()
  })

  it('should start an app on a dedicated PORT', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
      server: { port: '6543' },
    }
    const app = new BunApp()

    // WHEN
    const { url } = await app.start(config)

    // THEN
    expect(url).toBe('http://localhost:6543')
  })

  it('should check the app running status through /health endpoint', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
    }
    const app = new BunApp()
    const { url } = await app.start(config)

    // WHEN
    const { success } = await fetch(url + '/health').then((res) => res.json())

    // THEN
    expect(success).toBe(true)
  })
})

describe('stop', () => {
  it('should stop an app', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
    }
    const app = new BunApp()
    const startedApp = await app.start(config)

    // WHEN
    await startedApp.stop()
    const response = await fetch(startedApp.url).catch((err) => err)

    // THEN
    expect(response.message).toContain('Unable to connect.')
  })
})
