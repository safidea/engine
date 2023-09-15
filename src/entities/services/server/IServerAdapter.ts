import { App } from '@entities/app/App'
import { RequestDto } from './RequestDto'
import { ResponseDto } from '../../../adapters/spi/server/dtos/ResponseDto'

export interface ApiRoute {
  path: string
  method: string
  handler: (request: RequestDto) => Promise<ResponseDto>
}

export interface PageRoute {
  path: string
  method: string
  title: string
  handler: (request: PageRequest) => Promise<() => JSX.Element>
}

export interface PageRequest {
  path: string
  params: { [key: string]: string }
}

export interface IServerAdapter {
  port: number
  initConfig(app: App): void
  configureTables(routes: ApiRoute[]): Promise<void>
  configurePages(pages: PageRoute[]): Promise<void>
  configureStorage(routes: ApiRoute[]): Promise<void>
  start(): Promise<void>
  stop(): Promise<void>
}
