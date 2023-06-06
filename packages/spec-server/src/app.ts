import { join } from 'path'
import fs from 'fs-extra'
import runConfig from 'app-engine/config/run'

import type { ConfigSchemaInterface, EnvInterface } from 'server-common'

interface AppInterface {
  config: ConfigSchemaInterface
  env?: EnvInterface
  filename: string
}

class App {
  private path: string
  private name: string

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
}

export default App
