import { Base, type Params as BaseParams } from './base'

export interface Params extends BaseParams {
  body: unknown
}

export class Post extends Base {
  body: unknown

  constructor(params: Params) {
    super(params)
    this.body = params.body
  }

  getFromBody = (key: string): string | number | boolean | undefined => {
    const { body } = this
    if (typeof body === 'object' && body && key in body) {
      return body[key as keyof typeof body]
    }
    return undefined
  }

  getFromBodyOrThrow = (key: string): string | number | boolean => {
    const value = this.getFromBody(key)
    if (value === undefined) {
      throw new Error(`Key ${key} not found in body`)
    }
    return value
  }

  getFromBodyString = (key: string): string | undefined => {
    const value = this.getFromBody(key)
    if (value) return value.toString()
    return undefined
  }

  getFromBodyStringOrThrow = (key: string): string => {
    const value = this.getFromBodyOrThrow(key)
    return value.toString()
  }
}
