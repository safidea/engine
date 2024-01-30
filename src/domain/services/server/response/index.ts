import { JsonServerResponse, isJsonServerResponse } from './json'
import { TextServerResponse, isTextServerResponse } from './text'

export type ServerResponse =
  | JsonServerResponse
  | TextServerResponse

export function isServerResponse(value: unknown): value is ServerResponse {
  return (
    isJsonServerResponse(value) ||
    isTextServerResponse(value)
  )
}
