import type { GetRequest } from '@domain/entities/Request/Get'
import type { PatchRequest } from '@domain/entities/Request/Patch'
import type { PostRequest } from '@domain/entities/Request/Post'
import type { BaseRequestParams } from '@domain/entities/Request/base'
import type { Template } from '@domain/services/Template'

export class PageState {
  private _data: Partial<BaseRequestParams> = {}

  constructor(request: GetRequest | PostRequest | PatchRequest) {
    const state = request.getQuery('state')
    if (state) {
      this._data = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'))
    } else {
      const { path, baseUrl, query, params, headers } = request
      this._data = {
        path,
        baseUrl,
        query,
        params,
        headers,
      }
    }
  }

  getQuery = (): string => {
    const stringified = JSON.stringify(this._data)
    const base64 = Buffer.from(stringified).toString('base64')
    return `state=${base64}`
  }

  fillTemplate = (template: Template): string => {
    return template.fill(this._data)
  }

  addQueryToPath = (path: string): string => {
    if (path.includes('?')) {
      return path + `&${this.getQuery()}`
    } else {
      return path + `?${this.getQuery()}`
    }
  }

  isActiveLink = (href: string): boolean => {
    if (!this._data.path) return false
    return this._data.path === href
  }
}
