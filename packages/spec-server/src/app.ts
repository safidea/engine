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

interface AppInterface {
  config: ConfigInterface
  env?: EnvInterface
  filename: string
}

class App {
  private path: string
  private name: string
  private serverDomain = 'http://localhost:3000'

  constructor({ config, env = {}, filename }: AppInterface) {
    env.DATABASE_URL = env.DATABASE_URL ?? `postgresql://admin:admin@db/master`
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
    process.env.APP_PATH = this.path.split('foundation/')[1]
  }

  public async start(): Promise<void> {
    await runConfig()
  }

  public async seed(table: string, data: DatabaseDataType[]): Promise<void> {
    for (const item of data) await DatabaseService.create(table, { data: item })
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
}

export default App
