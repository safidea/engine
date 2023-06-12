import { DatabaseRowType } from 'shared-database'
import { URL } from 'url'

import type { FetcherProviderInterface, ResponseJsonType } from 'shared-app'
import { AppServer } from 'app-engine'

const domain = 'http://localhost:3000'

class FetcherProvider implements FetcherProviderInterface {
  private server

  constructor({ server }: { server: AppServer }) {
    this.server = server
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

  public async get(url: string): Promise<ResponseJsonType> {
    const params = this.getParams(url)
    const query = this.getQuery(url)
    const { status = 200, json } = await this.server.apiHandler({
      url,
      method: 'GET',
      params,
      query,
    })
    if (status !== 200) throw new Error(`Error ${status} fetching ${url}`)
    return json
  }

  public async post(url: string, body: DatabaseRowType): Promise<ResponseJsonType> {
    const params = this.getParams(url)
    const { status = 200, json } = await this.server.apiHandler({
      url,
      method: 'POST',
      params,
      query: {},
      body,
    })
    if (status !== 200) throw new Error(`Error ${status} fetching ${url}`)
    return json
  }

  public async put(url: string, body: DatabaseRowType): Promise<ResponseJsonType> {
    const params = this.getParams(url)
    const { status = 200, json } = await this.server.apiHandler({
      url,
      method: 'PUT',
      params,
      query: {},
      body,
    })
    if (status !== 200) throw new Error(`Error ${status} fetching ${url}`)
    return json
  }

  public async delete(url: string): Promise<ResponseJsonType> {
    const params = this.getParams(url)
    const { status = 200, json } = await this.server.apiHandler({
      url,
      method: 'DELETE',
      params,
      query: {},
    })
    if (status !== 200) throw new Error(`Error ${status} fetching ${url}`)
    return json
  }

  public async patch(url: string, body: DatabaseRowType): Promise<ResponseJsonType> {
    const params = this.getParams(url)
    const { status = 200, json } = await this.server.apiHandler({
      url,
      method: 'PATCH',
      params,
      query: {},
      body,
    })
    if (status !== 200) throw new Error(`Error ${status} fetching ${url}`)
    return json
  }
}

export default FetcherProvider
