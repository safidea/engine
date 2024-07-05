import { Base } from './base'

export type Type = 'ttf' | 'woff' | 'woff2' | 'otf'

export class Font extends Base {
  constructor(data: Buffer, type: Type) {
    super({
      body: data,
      headers: {
        'Content-Type': 'font/' + type,
      },
    })
  }
}

export function isFont(value: unknown): value is Font {
  return value instanceof Font
}
