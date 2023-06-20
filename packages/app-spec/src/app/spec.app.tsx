import '@testing-library/jest-dom'
import fs from 'fs-extra'
import { Response } from 'node-fetch'
import ResizeObserver from 'resize-observer-polyfill'
import { DatabaseDataType } from 'shared-database'
import { AppClient, AppServer } from 'app-engine'
import Image from 'next/image'
import Link from 'next/link'
import { SWRConfig } from 'swr'
import buildApp from '../utils/build-app.utils'
import FetcherProvider from '../providers/fetcher.provider'
import DatabaseProvider from '../providers/database.provider'
//import { Route, Routes, BrowserRouter } from 'react-router-dom'

import type { ConfigInterface } from 'shared-app'
import type { AppInterface } from '../utils/build-app.utils'

global.ResizeObserver = ResizeObserver
global.Response = Response as any

class App {
  private server: AppServer
  private path: string

  constructor({ config, env = {}, CustomDatabaseProvider }: AppInterface) {
    const { path, port } = buildApp({ config, env }, 'spec')
    this.path = path
    this.server = new AppServer({
      path,
      DatabaseProvider: CustomDatabaseProvider ?? DatabaseProvider,
    })
    global.fetch = async (url: RequestInfo | URL, init?: RequestInit | undefined) =>
      new FetcherProvider({ server: this.server, port }).fetch(url, init)
  }

  public async start() {
    await this.server.execConfig()
  }

  public async stop() {
    fs.removeSync(this.path)
  }

  public async seed(table: string, data: DatabaseDataType[]) {
    const res = await fetch(`/api/table/${table}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (res.status !== 200) {
      console.warn(await res.json())
      throw new Error(`Failed to seed table ${table}`)
    }
  }

  public page(path: string) {
    const config = this.server.getConfigFromPath() as ConfigInterface
    return (
      <SWRConfig value={{ provider: () => new Map() }}>
        <AppClient customComponents={{ Image, Link }} path={path} config={config} />
      </SWRConfig>
    )
    //const history = createMemoryHistory();
    /*return (
      <SWRConfig value={{ provider: () => new Map() }}>
      <Router history={history}>
          <Routes location={path}>
            <Route
              path="/"
              element={<AppClient customComponents={{ Image, Link }} path={'/'} config={config} />}
            />
            <Route
              path="/create"
              element={
                <AppClient customComponents={{ Image, Link }} path={'/create'} config={config} />
              }
            />
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    )*/
  }
}

export default App
