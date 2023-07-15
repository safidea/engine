import { test as base, expect } from '@playwright/test'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import debug from 'debug'
import fs from 'fs-extra'
import { join } from 'path'
import net from 'net'

const log = debug('specs:fixtures')

type Env = Record<string, string>
type AppConfig = {
  database: {
    url?: string
    provider: string
  }
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
    const server = spawn('node', ['dist/src/infrastructure/server.js'], {
      env: { ...process.env, ...env },
    })
    server.stdout.on('data', (data) => {
      const output = data.toString()
      log(`stdout: ${output}`)
      if (output.includes('Server is running')) {
        log('Server is ready, you can start testing now')
        resolve(server)
      }
    })
    server.stderr.on('data', (data) => {
      log(`stderr: ${data.toString()}`)
    })
    server.on('error', (error) => {
      log(`Error: ${error.message}`)
      reject(error)
    })
    server.on('close', (code) => {
      log(`Server process exited with code ${code}`)
    })
  })
}

type Fixtures = {
  port: number
  app: (config: AppConfig, env?: Env) => Promise<void>
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
    let server: ChildProcessWithoutNullStreams | undefined
    await fs.ensureDir(join(__dirname, './tmp/' + port))
    await use(async (config, env = {}) => {
      const path = join(__dirname, `./tmp/${port}/config.json`)
      await fs.writeJSON(path, config)
      server = await startServer({
        FOUNDATION_CONFIG: path,
        PORT: String(port),
        ...env,
      })
    })
    if (server) server.kill('SIGTERM')
    await fs.remove(join(__dirname, './tmp/' + port))
  },
})

export { test, expect }
