import AppServer from '../../server'
import { NextResponse } from 'next/server'
import { getPathFromParams } from '../../utils/next.utils'
import { getAppPath, getDatabaseProvider, getDatabaseProviderName } from '../../utils/server.utils'

import type { ConfigInterface, RequestInterface } from 'shared-app'
import type { PagesInterface } from 'shared-page'
import type { OptionsType } from '../../utils/next.utils'
import type { AppServerProps } from '../../server'

export type ContextRouteType = {
  params: { [key: string]: string }
}

class NextAppServer {
  server: AppServer

  constructor(props: AppServerProps) {
    this.server = new AppServer(props)
  }

  async route(request: Request, { params }: ContextRouteType) {
    const { url, method, body } = request
    const query = {}
    const req: RequestInterface = { url, method, query, params }
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) req.body = await request.json()
    const { json, status = 200 } = await this.server.apiHandler(req)
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
  cache: getDatabaseProviderName() !== 'json',
  DatabaseProvider: getDatabaseProvider(),
})
