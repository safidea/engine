import { Response } from '@domain/entities/table/Response'
import { Request } from '@domain/entities/table/Request'
import { App } from '@domain/entities/App'
export interface TableRoute {
  path: string
  method: string
  handler: (request: Request) => Promise<Response>
}

export interface PageRoute {
  path: string
  method: string
  title: string
  handler: (path: string) => Promise<() => JSX.Element>
}

export interface IServerGateway {
  configureTables(routes: TableRoute[]): Promise<void>
  configurePages(pages: PageRoute[], app: App): Promise<void>
  start(): Promise<void>
  stop(): Promise<void>
}
