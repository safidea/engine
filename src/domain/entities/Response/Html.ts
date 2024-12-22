import { BaseResponse } from './base'

export class HtmlResponse extends BaseResponse {
  constructor(html: string) {
    super({
      body: html,
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
}

export function isHtmlResponse(value: unknown): value is HtmlResponse {
  return value instanceof HtmlResponse
}
