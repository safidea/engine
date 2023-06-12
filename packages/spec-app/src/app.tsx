import fs from 'fs-extra'
import { join } from 'path'
import '@testing-library/jest-dom'
import ResizeObserver from 'resize-observer-polyfill'
import { DatabaseDataType } from 'shared-database'
import { AppClient, AppServer } from 'app-engine'
import Image from 'next/image'
import Link from 'next/link'
import { SWRConfig } from 'swr'

import FetcherProvider from './providers/fetcher.provider'
import DatabaseProvider from './providers/database.provider'

import type { DatabaseProviderConstructorInterface } from 'server-database'
import type { ConfigInterface, FetcherProviderInterface } from 'shared-app'

global.ResizeObserver = ResizeObserver

interface AppInterface {
  config: ConfigInterface
  env?: Record<string, string>
  CustomDatabaseProvider?: DatabaseProviderConstructorInterface
}

class App {
  private server: AppServer
  private customerFetcherProvider: FetcherProviderInterface

  constructor({ config, env = {}, CustomDatabaseProvider }: AppInterface) {
    env.PORT = env.PORT ?? '8000'
    const path = join(__dirname, '../build', config.name + '-' + env.PORT)
    fs.ensureDirSync(path)
    fs.writeFileSync(join(path, 'config.json'), JSON.stringify(config, null, 2))
    fs.writeFileSync(
      join(path, '.env'),
      Object.entries(env)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    )
    this.server = new AppServer({
      path,
      DatabaseProvider: CustomDatabaseProvider ?? DatabaseProvider,
    })
    this.customerFetcherProvider = new FetcherProvider({ server: this.server })
  }

  public async start() {
    await this.server.execConfig()
  }

  public async seed(table: string, data: DatabaseDataType[]) {
    await this.customerFetcherProvider.post(`/api/table/${table}`, data)
  }

  public page(path: string) {
    const config = this.server.getConfigFromPath() as ConfigInterface
    const client = new AppClient({
      customComponents: { Image, Link },
      fetcherProvider: this.customerFetcherProvider,
    })
    return (
      <SWRConfig value={{ provider: () => new Map() }}>
        {client.pageHandler(path, config)}
      </SWRConfig>
    )
  }
}

export default App
