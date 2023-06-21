import fs from 'fs-extra'
import { spawn, ChildProcess, execSync } from 'child_process'
import { join } from 'path'
import http from 'http'

import type { AppInterface } from '../src/utils/build-app.utils'

class App {
  private path: string
  private name: string
  public port: string
  private server: ChildProcess

  constructor({ config, env = {} }: AppInterface) {
    const buildFolderPath = join(__dirname, '../build')
    if (!env.PORT) {
      const nbApps = fs.readdirSync(buildFolderPath).length
      env.PORT = String(8000 + nbApps)
    }
    const name = config.name + '_' + env.PORT
    const path = join(buildFolderPath, name)
    fs.ensureDirSync(path)
    fs.writeFileSync(join(path, 'config.json'), JSON.stringify(config, null, 2))
    fs.writeFileSync(
      join(path, '.env'),
      Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    )
    this.port = env.PORT
    this.path = path
    this.name = name
    const command = join(__dirname.split('/packages')[0], 'scripts/start.sh')
    const args = ['-m', 'dev', '-f', this.path, '-d', 'json', '-p', this.port]
    this.server = spawn(command, args, {
      detached: true,
      stdio: 'ignore',
    })
    this.server.on('error', (error) => {
      console.error('An error occurred:', error.message)
    })
  }

  public async start(): Promise<void> {
    const url = 'http://localhost:' + this.port
    await new Promise<void>((resolve, reject) => {
      let retries = 0
      const testUrl = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000))
        if (retries++ > 30) {
          reject(new Error(`${url} is not available`))
        }
        http
          .get(url, (res) => {
            if (res.statusCode === 200) {
              resolve()
            } else {
              console.log(`${url} is not available yet, retrying...`)
              testUrl()
            }
          })
          .on('error', testUrl)
      }
      testUrl()
    })
  }

  public async stop(): Promise<void> {
    execSync(`kill $(lsof -t -i:${this.port})`)
    this.server.kill()
  }

  public async clear(): Promise<void> {}
}

export default App
