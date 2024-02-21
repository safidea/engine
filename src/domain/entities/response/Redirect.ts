import { Base } from './base'

export class Redirect extends Base {
  constructor(body: string) {
    super({ body, status: 302 })
  }
}

export function isRedirect(value: unknown): value is Redirect {
  return value instanceof Redirect
}
