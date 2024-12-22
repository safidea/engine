import { BaseResponse } from './base'

export class PdfResponse extends BaseResponse {
  constructor(filename: string, data: Buffer, status?: number) {
    super({
      body: data,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline`,
        'Content-Length': String(data.length),
      },
      status,
    })
  }
}

export function isPdfResponse(value: unknown): value is PdfResponse {
  return value instanceof PdfResponse
}
