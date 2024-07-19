import type { Get } from '@domain/entities/Request/Get'
import type { Patch } from '@domain/entities/Request/Patch'
import type { Post } from '@domain/entities/Request/Post'
import type { Params } from '@domain/entities/Request/base'
import type { Template } from '@domain/services/Template'

export class State {
  private data: Partial<Params> = {}

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

  isActiveLink = (href: string): boolean => {
    if (!this.data.path) return false
    return this.data.path.includes(href)
  }
}
