import { Html, isHTML } from './HTML'
import { Json, isJSON } from './JSON'

export type Response = Json | Html

export function isResponse(value: unknown): value is Response {
  return isJSON(value) || isHTML(value)
}
