import type { Get } from '@domain/entities/request/Get'
import type { Patch } from '@domain/entities/request/Patch'
import type { Post } from '@domain/entities/request/Post'
import type { Template } from '@domain/services/Template'

export class State {
  private data = {}

  constructor(request: Get | Post | Patch) {
    const state = request.getQuery('state')
    if (state) {
      this.data = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'))
    } else {
      const { path, baseUrl, query, params, headers } = request
      this.data = {
        path,
        baseUrl,
        query,
        params,
        headers,
      }
    }
  }

  getQuery = (): string => {
    const stringified = JSON.stringify(this.data)
    const base64 = Buffer.from(stringified).toString('base64')
    return `state=${base64}`
  }

  fillTemplate = (template: Template): string => {
    return template.fill(this.data)
  }

  addQueryToPath = (path: string): string => {
    if (path.includes('?')) {
      return path + `&${this.getQuery()}`
    } else {
      return path + `?${this.getQuery()}`
    }
  }
}
