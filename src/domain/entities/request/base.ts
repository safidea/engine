export type Params = {
  path: string
  baseUrl: string
  headers: { [key: string]: string }
  query: { [key: string]: string }
  params: { [key: string]: string }
}

export class Base {
  constructor(private _params: Params) {}

  get path() {
    return this._params.path
  }

  get baseUrl() {
    return this._params.baseUrl
  }

  get headers() {
    return this._params.headers
  }

  get query() {
    return this._params.query
  }

  get params() {
    return this._params.params
  }
}
