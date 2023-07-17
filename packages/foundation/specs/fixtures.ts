import debug from 'debug'
import { test as base, expect } from '@playwright/test'
import net from 'net'
import { App } from './app'
import { Helpers } from './helpers'

const log = debug('specs:fixtures')

interface Fixtures {
  port: number
  app: App
  helpers: Helpers
}

async function findAvailablePort(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, () => {
      const { port } = server.address() as net.AddressInfo
      server.close(() => {
        resolve(port)
      })
    })
  })
}

const test = base.extend<Fixtures>({
  port: async ({}, use) => {
    const freePort = await findAvailablePort()
    await use(freePort)
  },
  baseURL: async ({ port }, use) => {
    const baseURL = `http://localhost:${port}`
    await use(baseURL)
  },
  app: async ({ port }, use) => {
    const app = new App(port)
    await use(app)
    app.stop()
  },
  helpers: async ({}, use) => {
    const helpers = new Helpers()
    await use(helpers)
  },
})

test.beforeEach(async ({ page }) => {
  page.on('console', (message) => {
    log(`Browser console: ${message.text()}`)
  })
  page.on('request', (request) => {
    log(`Request: ${request.url()}`)
  })
  page.on('response', (response) => {
    log(`Response: ${response.url()} Status: ${response.status()}`)
  })
})

export { test, expect }
