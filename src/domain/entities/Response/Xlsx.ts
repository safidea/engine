import { BaseResponse } from './base'

export class XlsxResponse extends BaseResponse {
  constructor(filename: string, data: Buffer, status?: number) {
    super({
      body: data,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(data.length),
      },
      status,
    })
  }
}

export function isXlsxResponse(value: unknown): value is XlsxResponse {
  return value instanceof XlsxResponse
}
