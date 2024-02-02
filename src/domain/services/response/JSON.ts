import { Base } from './base'

export class Json extends Base {
  constructor(json: object) {
    super({
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export function isJSON(value: unknown): value is Json {
  return value instanceof Json
}
