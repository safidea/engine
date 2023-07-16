import { getSchema } from '@infrastructure/config/schema'
import { ReactElement } from 'react'

export class AppRepository {
  async getSchema(): Promise<any> {
    return getSchema()
  }
  async getPage(path: string): Promise<ReactElement> {
    return <div>{path}</div>
  }
  async requestRoute(): Promise<any> {
    return { message: 'Hello World !!!' }
  }
}
