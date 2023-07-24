import { RecordDto } from '@application/dtos/RecordDto'
import { Request } from '@domain/entities/Request'
export interface TableRoute {
  path: string
  method: string
  handler: (request: Request) => Promise<RecordDto | RecordDto[] | string | string[] | void>
}

export interface PageRoute {
  path: string
  method: string
  handler: (path: string) => Promise<JSX.Element>
}

export interface IServerRepository {
  configureTables(routes: TableRoute[]): Promise<void>
  configurePages(pages: PageRoute[]): Promise<void>
  start(): Promise<void>
  stop(): Promise<void>
}