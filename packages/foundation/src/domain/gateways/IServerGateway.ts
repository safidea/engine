import { Response } from '@domain/entities/table/Response'
import { Request } from '@domain/entities/table/Request'
import { PageDto } from '@application/dtos/page/PageDto'
import { TableDto } from '@application/dtos/table/TableDto'
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
  // TODO: remove the DTOs from domain
  pageDto: PageDto
  tablesDto: TableDto[]
}

export interface IServerGateway {
  configureTables(routes: TableRoute[]): Promise<void>
  configurePages(pages: PageRoute[]): Promise<void>
  start(): Promise<void>
  stop(): Promise<void>
}
