import { Base } from './base'

export class HTMLResponse extends Base {
  constructor(html: string) {
    super({
      body: html,
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
}

export function isHTML(value: unknown): value is HTMLResponse {
  return value instanceof HTMLResponse
}
