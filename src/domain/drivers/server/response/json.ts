import { BaseResponse } from './base'

export class JsonServerResponse extends BaseResponse {
  body: object

  constructor(json: object, statusCode?: number) {
    super(statusCode)
    this.body = json
  }
}

export function isJsonServerResponse(value: unknown): value is JsonServerResponse {
  return value instanceof JsonServerResponse
}
