import { BaseResponse } from './base'

export type Type = 'ttf' | 'woff' | 'woff2' | 'otf'

export class FontResponse extends BaseResponse {
  constructor(data: Buffer, type: Type) {
    super({
      body: data,
      headers: {
        'Content-Type': 'font/' + type,
      },
    })
  }
}

export function isFontResponse(value: unknown): value is FontResponse {
  return value instanceof FontResponse
}
