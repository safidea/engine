import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import debug from 'debug'
import fs from 'fs-extra'
import { join } from 'path'
import net from 'net'
import { test as base, expect } from '@playwright/test'
import { AppDto } from '@application/dtos/AppDto'
import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'

const log = debug('specs:fixtures')

interface Env {
  [key: string]: string
}
interface Fixtures {
  port: number
  startApp: (schema: AppDto, env?: Env) => Promise<InMemoryOrm>
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

async function startServer(env: Env = {}): Promise<ChildProcessWithoutNullStreams> {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['dist/src/infrastructure/server/express.js'], {
      env: { ...process.env, ...env },
    })
    server.stdout.on('data', (data) => {
      const output = data.toString()
      if (output.includes('Server is running')) {
        resolve(server)
      }
    })
    server.on('error', (error) => {
      log(`Error: ${error.message}`)
      reject(error)
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
  startApp: async ({ port }, use) => {
    let server: ChildProcessWithoutNullStreams | undefined
    await fs.ensureDir(join(__dirname, './tmp/' + port))
    await use(async (config, env = {}) => {
      const appFolder = join(process.cwd(), `specs/tmp/${port}`)
      await fs.writeJSON(join(appFolder, 'app.json'), config)
      server = await startServer({
        FOUNDATION_APP_FOLDER: appFolder,
        PORT: String(port),
        ...env,
      })
      server.stdout.on('data', (data) => {
        log(`Server console: ${data.toString()}`)
      })
      server.stderr.on('data', (data) => {
        log(`Server error: ${data.toString()}`)
      })
      return new InMemoryOrm(appFolder)
    })
    if (server) server.kill('SIGTERM')
    await fs.remove(join(__dirname, './tmp/' + port))
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
