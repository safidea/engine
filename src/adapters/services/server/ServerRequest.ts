export interface ServerRequestQuery {
  [key: string]: string
}

export interface ServerRequest {
  method: string
  path: string
  body?: unknown
  params?: {
    [key: string]: string
  }
  query?: ServerRequestQuery
}
