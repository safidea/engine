import AppServer from '../src/server'
import { NextResponse } from 'next/server'
import { getPathFromParams, getAppPath } from './shared'
import { DatabaseDataType, PrismaProvider } from 'server-database'

import type { PagesInterface } from 'shared-page'
import type { ParamsType } from './shared'
import type { DatabaseProviderConstructorInterface } from 'server-database'

class NextAppServer extends AppServer {
  private pages: PagesInterface

  constructor(props: { path: string; DatabaseProvider: DatabaseProviderConstructorInterface }) {
    super(props)
    this.pages = (this.getConfigFromPath('pages') ?? {}) as PagesInterface
  }

  async route(request: Request, params: { [key: string]: string }) {
    const { url, method } = request
    const query = {}
    let body: DatabaseDataType | DatabaseDataType[] | undefined
    if (['POST', 'GET', 'PUT', 'PATCH'].includes(method)) {
      body = await request.json()
    }
    const { json, status = 200 } = await super.apiHandler({ body, method, params, url, query })
    return NextResponse.json(json, { status })
  }

  async generateStaticParams() {
    const paths = Object.keys(this.pages)
    return paths
      .map((path) => path.substring(1))
      .filter((path) => path !== '')
      .map((path) => ({ path: path.split('/') }))
  }

  async generateMetadata({ params }: { params: ParamsType }) {
    const path = getPathFromParams(params)
    if (this.pages[path] == null) return {}
    const { title, metadata = {} } = this.pages[path]
    return { title, ...metadata }
  }
}

export default new NextAppServer({
  path: getAppPath(),
  DatabaseProvider: PrismaProvider,
})
