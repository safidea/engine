import fs from 'fs-extra'
import { join } from 'path'

import type { ConfigInterface, EnvInterface } from 'shared-app'
import type { DatabaseProviderConstructorInterface } from 'server-database'

export interface AppInterface {
  config: ConfigInterface
  env?: EnvInterface
  CustomDatabaseProvider?: DatabaseProviderConstructorInterface
}

export default function buildApp({ config, env = {} }: AppInterface, type: 'e2e' | 'spec') {
  const buildFolderPath = join(__dirname, '../../build', type)
  if (!env.PORT) {
    const nbApps = fs.readdirSync(buildFolderPath).length
    env.PORT = String(8000 + nbApps)
  }
  const name = type === 'e2e' ? config.name : config.name + '_' + env.PORT
  const path = join(buildFolderPath, name)
  env.APP_NAME = env.APP_NAME ?? name
  env.APP_PATH = env.APP_PATH ?? path
  fs.ensureDirSync(path)
  fs.writeFileSync(join(path, 'config.json'), JSON.stringify(config, null, 2))
  fs.writeFileSync(
    join(path, '.env'),
    Object.entries(env)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')
  )
  return { path, port: env.PORT, name }
}
