import { URL } from 'url'

import type { RequestInterface } from 'shared-app'
import { AppServer } from 'app-engine'

const domain = 'http://localhost:3000'

class FetcherProvider {
  private server

  constructor({ server }: { server: AppServer }) {
    this.server = server
  }

  public async fetch(url: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
    const { method = 'GET', body } = init || {}
    const params = this.getParams(String(url))
    const query = this.getQuery(String(url))
    const request: RequestInterface = { url: String(url), method, params, query }
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) request.body = JSON.parse(body as string)
    const { json, status = 200 } = await this.server.apiHandler(request)
    return new Response(JSON.stringify(json), { status })
  }

  private getParams(url: string): { [key: string]: string } {
    const path = url.match(/(?<=api\/).*(?=\??)/)?.[0]
    if (!path) return {}
    const [api, p1, p2] = path.split('/')
    switch (api) {
      case 'table':
        return { table: p1, id: p2 }
      default:
        return {}
    }
  }

  private getQuery(url: string): { [key: string]: string } {
    const parsedUrl = new URL(domain + url)
    return [...parsedUrl.searchParams.entries()].reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {}
    )
  }
}

export default FetcherProvider
