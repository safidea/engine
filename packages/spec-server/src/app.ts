import { join } from 'path'
import fs from 'fs-extra'
import runConfig from 'app-engine/config/run'
import { DatabaseService } from 'server-database'
import { TableRoute } from 'server-table'

import type { ConfigInterface, EnvInterface } from 'shared-config'
import type { DatabaseDataType } from 'shared-database'

jest.mock('server-database/prisma/client', () => {
  return jest.requireActual('../__mocks__/prisma/client')
})

// When need to mock child_process when need to provide a database in the configuration
//jest.mock('child_process')

interface AppInterface {
  config: ConfigInterface
  env: EnvInterface
  filename: string
}

class App {
  private path: string
  private name: string
  private serverDomain = 'http://localhost:3000'

  constructor({ config, env, filename }: AppInterface) {
    env.PORT = env.PORT ?? '8000'
    env.DATABASE_URL = env.DATABASE_URL ?? `postgresql://admin:admin@db/master`
    this.name = (filename.match(/[a-z]*(?=\.spec)/) || ['app'])[0] + '-' + env.PORT
    this.path = join(__dirname, '../build', this.name)
    fs.ensureDirSync(this.path)
    fs.writeFileSync(join(this.path, 'config.json'), JSON.stringify(config, null, 2))
    fs.writeFileSync(
      join(this.path, '.env'),
      Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    )
  }

  public async start(): Promise<void> {
    await runConfig(this.path)
  }

  public async seed(table: string, data: DatabaseDataType[]): Promise<void> {
    const rows = await DatabaseService.list(table)
    for (const row of rows) await DatabaseService.deleteById(table, { id: row.id })
    for (const item of data) await this.post(`/api/table/${table}`, item)
  }

  public async get(url: string) {
    const [, , feature, domain, key] = url.split('/')
    const request = new Request(this.serverDomain + url, {
      method: 'GET',
    })
    switch (feature) {
      case 'table':
        return TableRoute.GET(request, { params: { table: domain, id: key } })
      default:
        throw new Error(`Feature ${feature} not supported`)
    }
  }

  public async post(url: string, body: any) {
    const [, , feature, domain, key] = url.split('/')
    const request = new Request(this.serverDomain + url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    switch (feature) {
      case 'table':
        return TableRoute.POST(request, { params: { table: domain, id: key } })
      default:
        throw new Error(`Feature ${feature} not supported`)
    }
  }
}

export default App
