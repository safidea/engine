import { Base } from './base'

export class Docx extends Base {
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

export function isDocx(value: unknown): value is Docx {
  return value instanceof Docx
}
