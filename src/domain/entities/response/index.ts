import { type Css, isCss } from './Css'
import { type Html, isHtml } from './Html'
import { type Json, isJson } from './Json'
import { type Redirect, isRedirect } from './Redirect'
import { type Stream, isStream } from './Stream'

export type Response = Json | Html | Redirect | Stream | Css

export function isResponse(value: unknown): value is Response {
  return isJson(value) || isHtml(value) || isRedirect(value) || isStream(value) || isCss(value)
}
