export interface IServerRequestQuery {
  [key: string]: string
}

export interface IServerRequest {
  method: string
  path: string
  body?: unknown
  params?: {
    [key: string]: string
  }
  query?: IServerRequestQuery
  headers: {
    [key: string]: string
  }
}
