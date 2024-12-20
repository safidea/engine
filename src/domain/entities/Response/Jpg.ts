import { BaseResponse } from './base'

export class JpgResponse extends BaseResponse {
  constructor(filename: string, data: Buffer, status?: number) {
    super({
      body: data,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline`,
        'Content-Length': String(data.length),
      },
      status,
    })
  }
}

export function isJpgResponse(value: unknown): value is JpgResponse {
  return value instanceof JpgResponse
}
