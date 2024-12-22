import { BaseResponse } from './base'

export class JsonResponse extends BaseResponse {
  constructor(json: object, status?: number) {
    super({
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json',
      },
      status,
    })
  }
}

export function isJsonResponse(value: unknown): value is JsonResponse {
  return value instanceof JsonResponse
}
