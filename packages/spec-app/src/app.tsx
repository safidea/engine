import fs from 'fs-extra'
import { join } from 'path'
import '@testing-library/jest-dom'
import { Response } from 'node-fetch'
import ResizeObserver from 'resize-observer-polyfill'
import { DatabaseDataType } from 'shared-database'
import { AppClient, AppServer } from 'app-engine'
import Image from 'next/image'
import Link from 'next/link'
import { SWRConfig } from 'swr'

import FetcherProvider from './providers/fetcher.provider'
import DatabaseProvider from './providers/database.provider'

import type { DatabaseProviderConstructorInterface } from 'server-database'
import type { ConfigInterface } from 'shared-app'

global.ResizeObserver = ResizeObserver
global.Response = Response as any

interface AppInterface {
  config: ConfigInterface
  env?: Record<string, string>
  CustomDatabaseProvider?: DatabaseProviderConstructorInterface
}

class App {
  private server: AppServer
  private path: string

  constructor({ config, env = {}, CustomDatabaseProvider }: AppInterface) {
    if (!env.PORT) {
      const nbApps = fs.readdirSync(join(__dirname, '../build')).length
      env.PORT = String(8000 + nbApps)
    }
    this.path = join(__dirname, '../build', config.name + '-' + env.PORT)
    fs.ensureDirSync(this.path)
    fs.writeFileSync(join(this.path, 'config.json'), JSON.stringify(config, null, 2))
    fs.writeFileSync(
      join(this.path, '.env'),
      Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    )
    this.server = new AppServer({
      path: this.path,
      DatabaseProvider: CustomDatabaseProvider ?? DatabaseProvider,
    })
    global.fetch = async (url: RequestInfo | URL, init?: RequestInit | undefined) =>
      new FetcherProvider({ server: this.server }).fetch(url, init)
  }

  public async start() {
    await this.server.execConfig()
  }

  public async stop() {
    fs.removeSync(this.path)
  }

  public async seed(table: string, data: DatabaseDataType[]) {
    await fetch(`/api/table/${table}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public page(path: string) {
    const config = this.server.getConfigFromPath() as ConfigInterface
    return (
      <SWRConfig value={{ provider: () => new Map() }}>
        <AppClient customComponents={{ Image, Link }} path={path} config={config} />
      </SWRConfig>
    )
  }
}

export default App
