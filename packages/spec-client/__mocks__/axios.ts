import { DatabaseRowType, DatabaseDataType } from 'shared-database'

type DbType = {
  [key: string]: DatabaseRowType[]
}

class MockAxios {
  private db: DbType = {}

  private getTableFromUrl(url: string): string {
    return url.split('/').pop() as string
  }

  public get = jest.fn((url: string) => {
    const table = this.getTableFromUrl(url)
    return Promise.resolve({
      data: this.db[table],
    })
  })

  public post(url: string, data: DatabaseDataType[]): void {
    const table = this.getTableFromUrl(url)
    this.db[table] = data.map((row, index) => ({
      ...row,
      id: index + 1,
      created_at: new Date().toISOString(),
    }))
  }
}

export default new MockAxios()
