import { HTMLResponse, isHTML } from './HTML'
import { JSONResponse, isJSON } from './JSON'

export type Response = JSONResponse | HTMLResponse

export function isResponse(value: unknown): value is Response {
  return isJSON(value) || isHTML(value)
}
