import { BaseResponse } from './base'

export class TextServerResponse extends BaseResponse {
  headers?: { [key: string]: string }
  body: string

  constructor(text: string, headers?: { [key: string]: string }, statusCode?: number) {
    super(statusCode)
    this.body = text
    if (headers) this.headers = headers
  }
}

export function isTextServerResponse(value: unknown): value is TextServerResponse {
  return value instanceof TextServerResponse
}
