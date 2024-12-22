import { BaseResponse } from './base'

export class DocxResponse extends BaseResponse {
  constructor(filename: string, data: Buffer, status?: number) {
    super({
      body: data,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(data.length),
      },
      status,
    })
  }
}

export function isDocxResponse(value: unknown): value is DocxResponse {
  return value instanceof DocxResponse
}
