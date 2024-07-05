import { Base } from './base'

export class Redirect extends Base {
  constructor(url: string) {
    super({ url, status: 302 })
  }
}

export function isRedirect(value: unknown): value is Redirect {
  return value instanceof Redirect
}
