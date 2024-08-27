import { Base } from './base'

export class Xlsx extends Base {
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

export function isXlsx(value: unknown): value is Xlsx {
  return value instanceof Xlsx
}
