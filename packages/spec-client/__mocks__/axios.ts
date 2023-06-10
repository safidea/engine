import { DatabaseRowType, DatabaseDataType } from 'shared-database'
import { TableRoute } from 'server-table'

import type { ResponseInterface } from 'server-common'

type DbType = {
  [key: string]: DatabaseRowType[]
}

class MockAxios {
  private db: DbType = {}
  private serverDomain = 'http://localhost:3000'

  private getTableFromUrl(url: string): string {
    return url.split('/').pop() as string
  }

  public async get(url: string) {
    if (url === '/api/table/invoices') {
      const request = {
        url: this.serverDomain + url,
        method: 'GET',
        json: () => {},
      } as unknown as Request
      const res = await TableRoute.GET(request, { params: { table: 'invoices' } })
      return { data: res.json }
    } else {
      throw new Error('Not implemented: ' + url)
    }
  }

  public async post(url: string, data: DatabaseDataType[]): Promise<void> {
    for (const row of data) {
      const request = {
        url: this.serverDomain + url,
        method: 'POST',
        json: () => Promise.resolve(row),
      } as unknown as Request
      await TableRoute.POST(request, { params: { table: 'invoices' } })
    }
  }
}

export default new MockAxios()
