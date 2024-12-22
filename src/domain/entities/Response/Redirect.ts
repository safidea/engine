import { BaseResponse } from './base'

export class RedirectResponse extends BaseResponse {
  constructor(url: string) {
    super({ url, status: 302 })
  }
}

export function isRedirectResponse(value: unknown): value is RedirectResponse {
  return value instanceof RedirectResponse
}
