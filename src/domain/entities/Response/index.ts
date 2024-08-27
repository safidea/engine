import { type Css, isCss } from './Css'
import { type Docx, isDocx } from './Docx'
import { type Font, isFont } from './Font'
import { type Html, isHtml } from './Html'
import { type Json, isJson } from './Json'
import { type Redirect, isRedirect } from './Redirect'
import { type Stream, isStream } from './Stream'
import { type Xlsx, isXlsx } from './Xlsx'

export type Response = Json | Html | Redirect | Stream | Css | Font | Docx | Xlsx

export function isResponse(value: unknown): value is Response {
  return (
    isJson(value) ||
    isHtml(value) ||
    isRedirect(value) ||
    isStream(value) ||
    isCss(value) ||
    isFont(value) ||
    isDocx(value) ||
    isXlsx(value)
  )
}
