import { RecordDto } from '@application/dtos/RecordDto'
import { Request } from '@domain/entities/Request'
export interface Route {
  path: string
  method: string
  handler: (request: Request) => Promise<RecordDto | RecordDto[] | string | string[]>
}

export interface Page {
  path: string
  method: string
  handler: (path: string) => Promise<JSX.Element>
}

export interface IServerRepository {
  configureRoutes(routes: Route[]): Promise<void>
  configurePages(pages: Page[]): Promise<void>
  start(): Promise<void>
  stop(): Promise<void>
}
