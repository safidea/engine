import { BaseResponse } from './base'

export class PngResponse extends BaseResponse {
  constructor(filename: string, data: Buffer, status?: number) {
    super({
      body: data,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline`,
        'Content-Length': String(data.length),
      },
      status,
    })
  }
}

export function isPngResponse(value: unknown): value is PngResponse {
  return value instanceof PngResponse
}
