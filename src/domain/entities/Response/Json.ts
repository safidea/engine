import { Base } from './base'

export class Json extends Base {
  constructor(json: object, status?: number) {
    super({
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json',
      },
      status,
    })
  }
}

export function isJson(value: unknown): value is Json {
  return value instanceof Json
}
