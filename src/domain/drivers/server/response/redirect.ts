import { BaseResponse } from './base'

export class RedirectServerResponse extends BaseResponse {
  path: string

  constructor(path: string, statusCode = 302) {
    super(statusCode)
    this.path = path
  }
}

export function isRedirectServerResponse(value: unknown): value is RedirectServerResponse {
  return value instanceof RedirectServerResponse
}
