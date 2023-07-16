import { AppDto } from '@application/dtos/AppDto'
import { ResponseDto } from '@application/dtos/ResponseDto'
import { getSchema } from '@infrastructure/config/schema'
import { ReactElement } from 'react'

export class AppRepository {
  async getSchema(): Promise<AppDto> {
    return getSchema()
  }
  async getPage(path: string): Promise<ReactElement> {
    return (
      <div>
        <h1>Hello World!</h1>
        <p>path: {path}</p>
      </div>
    )
  }
  async requestRoute(): Promise<ResponseDto> {
    return { message: 'Hello World!' }
  }
}
