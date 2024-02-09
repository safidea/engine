import { Html, isHtml } from './Html'
import { Json, isJson } from './Json'

export type Response = Json | Html

export function isResponse(value: unknown): value is Response {
  return isJson(value) || isHtml(value)
}
