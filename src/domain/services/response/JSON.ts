import { Base } from './base'

export class JSONResponse extends Base {
  constructor(json: object) {
    super({
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export function isJSON(value: unknown): value is JSONResponse {
  return value instanceof JSONResponse
}
