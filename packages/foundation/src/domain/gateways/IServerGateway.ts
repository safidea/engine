import { Response } from '@domain/entities/table/Response'
import { Request } from '@domain/entities/table/Request'
import { PageDto } from '@application/dtos/page/PageDto'
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
  // TODO: remove the DTO from domain
  config: PageDto
}

export interface IServerGateway {
  configureTables(routes: TableRoute[]): Promise<void>
  configurePages(pages: PageRoute[]): Promise<void>
  start(): Promise<void>
  stop(): Promise<void>
}
