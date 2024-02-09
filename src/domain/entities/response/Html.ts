import { Base } from './base'

export class Html extends Base {
  constructor(html: string) {
    super({
      body: html,
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
}

export function isHtml(value: unknown): value is Html {
  return value instanceof Html
}
