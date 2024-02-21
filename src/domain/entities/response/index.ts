import { type Html, isHtml } from './Html'
import { type Json, isJson } from './Json'
import { type Redirect, isRedirect } from './Redirect'

export type Response = Json | Html | Redirect

export function isResponse(value: unknown): value is Response {
  return isJson(value) || isHtml(value) || isRedirect(value)
}
