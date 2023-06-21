import fs from 'fs-extra'
import { execSync } from 'child_process'
import { join } from 'path'
import http from 'http'
import buildApp from '../utils/build-app.utils'

import type { AppInterface } from '../utils/build-app.utils'

const pathToDockerCompose = join(__dirname, '../../docker-compose.yml')
const pgDefaultCredentials = {
  host: '0.0.0.0',
  user: 'admin',
  password: 'admin',
  database: 'master',
  port: '5432',
}

class App {
  private path: string
  private name: string
  public port: string

  constructor({ config, env = {} }: AppInterface) {
    const { path, port, name } = buildApp({ config, env }, 'e2e')
    this.port = port
    this.path = path
    this.name = name
    fs.copyFileSync(pathToDockerCompose, join(this.path, 'docker-compose.yml'))
  }

  public async start(): Promise<void> {
    const url = 'http://localhost:' + this.port
    const envPath = join(this.path, '.env')
    const dockerComposePath = join(this.path, 'docker-compose.yml')
    execSync(`docker compose --env-file ${envPath} -f ${dockerComposePath} up -d`, {
      stdio: 'inherit',
    })
    console.log(`Waiting for app ${this.name} to start...`)
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
              testUrl()
            }
          })
          .on('error', testUrl)
      }
      testUrl()
    })
    console.log(`App ${this.name} started on`, url)
  }

  public async stop(): Promise<void> {}

  public async clear(): Promise<void> {}
}

export default App
