import fs from 'fs-extra'
import { join } from 'path'
import debug from 'debug'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import { AppDto } from '@application/dtos/AppDto'
import { Database } from './db'

const log = debug('specs:app')

interface Env {
  [key: string]: string
}

export class App {
  private server?: ChildProcessWithoutNullStreams
  private readonly folder: string

  constructor(private port: number) {
    this.folder = join(process.cwd(), `specs/tmp/${port}`)
  }

  async start(appSchema: AppDto, env: Env = {}): Promise<Database> {
    await fs.ensureDir(join(__dirname, './tmp/' + this.port))
    await fs.writeJSON(join(this.folder, 'app.json'), appSchema)
    this.server = await new Promise((resolve, reject) => {
      const server = spawn('node', ['dist/src/infrastructure/app.js'], {
        env: {
          ...process.env,
          FOUNDATION_APP_FOLDER: this.folder,
          PORT: String(this.port),
          ...env,
        },
      })
      server.stdout.on('data', (data) => {
        const output = data.toString()
        log(`Server console: ${output}`)
        if (output.includes('Server is running')) {
          resolve(server)
        }
      })
      server.stderr.on('data', (data) => {
        const error = data.toString()
        log(`Server error: ${error}`)
        reject(error)
      })
      server.on('error', (error) => {
        log(`Server error: ${error.message}`)
        reject(error)
      })
      server.on('close', (code) => {
        log(`Server closed with code: ${code}`)
      })
    })
    const db = new Database(this.folder)
    if (appSchema.tables) {
      db.configure(appSchema.tables as any)
    }
    return db
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.kill('SIGTERM')
      this.server = undefined
    }
    await fs.remove(join(__dirname, './tmp/' + this.port))
  }
}
