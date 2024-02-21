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

  getQuery = (key: string): string | undefined => {
    const { query } = this
    if (key in query) return query[key]
    return undefined
  }

  getQueryOrThrow = (key: string): string => {
    const value = this.getQuery(key)
    if (value === undefined) {
      throw new Error(`Key ${key} not found in query`)
    }
    return value
  }
}
