import AppServer from '../src/server'
import { NextResponse } from 'next/server'
import { getPathFromParams, getAppPath } from './shared'
import { DatabaseDataType } from 'server-database'
import PrismaProvider from '../src/providers/prisma.provider'

import type { ConfigInterface } from 'shared-app'
import type { PagesInterface } from 'shared-page'
import type { OptionsType } from './shared'
import type { AppServerProps } from '../src/server'

export type ContextRouteType = {
  params: { [key: string]: string }
}

class NextAppServer {
  server: AppServer

  constructor(props: AppServerProps) {
    this.server = new AppServer(props)
  }

  async route(request: Request, { params }: ContextRouteType) {
    const { url, method } = request
    const query = {}
    let body: DatabaseDataType | DatabaseDataType[] | undefined
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await request.json()
    }
    const { json, status = 200 } = await this.server.apiHandler({
      body,
      method,
      params,
      url,
      query,
    })
    return NextResponse.json(json, { status })
  }

  async generateStaticParams() {
    const pages = this.server.getConfigFromPath('pages') as PagesInterface
    const paths = Object.keys(pages)
    return paths
      .map((path) => path.substring(1))
      .filter((path) => path !== '')
      .map((path) => ({ path: path.split('/') }))
  }

  async generateMetadata({ params }: OptionsType) {
    const pages = this.server.getConfigFromPath('pages') as PagesInterface
    const path = getPathFromParams(params)
    if (pages[path] == null) return {}
    const { title, metadata = {} } = pages[path]
    return { title, ...metadata }
  }

  async execConfig() {
    await this.server.execConfig()
  }

  getConfig(): ConfigInterface {
    return this.server.getConfigFromPath() as ConfigInterface
  }
}

export default new NextAppServer({
  path: getAppPath(),
  DatabaseProvider: PrismaProvider,
})
