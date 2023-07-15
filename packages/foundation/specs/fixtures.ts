import { test as base, expect } from '@playwright/test'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import debug from 'debug'

const log = debug('specs:fixtures')

async function startServer(): Promise<ChildProcessWithoutNullStreams> {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['dist/src/server.js'])
    server.stdout.on('data', (data) => {
      const output = data.toString()
      log(`stdout: ${output}`)
      if (output.includes('Server is running!')) {
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

const test = base.extend({
  app: async ({}, use) => {
    let server: ChildProcessWithoutNullStreams | undefined
    await use(async () => {
      server = await startServer()
    })
    if (server) server.kill('SIGTERM')
  },
})

export { test, expect }
