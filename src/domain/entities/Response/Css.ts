import { BaseResponse } from './base'

export class CssResponse extends BaseResponse {
  constructor(css: string) {
    super({
      body: css,
      headers: {
        'Content-Type': 'text/css',
      },
    })
  }
}

export function isCssResponse(value: unknown): value is CssResponse {
  return value instanceof CssResponse
}
