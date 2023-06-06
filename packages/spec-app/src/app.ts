import type { ConfigSchemaInterface, EnvInterface } from 'server-common'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import { join } from 'path'
import http from 'http'

interface AppInterface {
  config: ConfigSchemaInterface
  env: EnvInterface
  filename: string
}

class App {
  private path: string
  private port: string
  private name: string

  constructor({ config, env, filename }: AppInterface) {
    env.DATABASE_URL = env.DATABASE_URL ?? `postgresql://admin:admin@db/master`
    config.database = config.database ?? {
      url: '${DATABASE_URL}',
      provider: 'postgresql',
    }
    this.port = env.PORT || '3000'
    this.name = (filename.match(/[a-z]*(?=\.spec)/) || ['app'])[0]
    this.path = join(__dirname, '../build', this.name)
    fs.ensureDirSync(this.path)
    fs.writeFileSync(join(this.path, 'config.json'), JSON.stringify(config, null, 2))
    fs.writeFileSync(
      join(this.path, '.env'),
      Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    )
    let compose = fs.readFileSync(join(__dirname, 'docker-compose.yml'), 'utf-8')
    compose = compose.replace(/\$\{APP_PATH\}/g, this.path)
    compose = compose.replace(/\$\{APP_NAME\}/g, this.name)
    compose = compose.replace('${PORT_APP}', this.port)
    compose = compose.replace('${PORT_DB}', env.DATABASE_URL?.match(/:(\d+)\//)?.[1] || '5432')
    fs.writeFileSync(join(this.path, 'docker-compose.yml'), compose)
  }

  public async start(): Promise<void> {
    const url = 'http://localhost:' + this.port
    execSync(`docker compose -f ${join(this.path, 'docker-compose.yml')} up -d`, {
      stdio: 'ignore',
    })
    console.log(`Waiting for app ${this.name} to start...`)
    await new Promise<void>((resolve, reject) => {
      let retries = 0
      const testUrl = async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000))
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

  public async stop(): Promise<void> {
    execSync(`docker compose -f ${join(this.path, 'docker-compose.yml')} down`, { stdio: 'ignore' })
  }
}

export default App
