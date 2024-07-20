import { Base } from './base'

export class Css extends Base {
  constructor(css: string) {
    super({
      body: css,
      headers: {
        'Content-Type': 'text/css',
      },
    })
  }
}

export function isCss(value: unknown): value is Css {
  return value instanceof Css
}
