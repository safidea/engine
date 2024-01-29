import { JsonServerResponse, isJsonServerResponse } from './json'
import { RedirectServerResponse, isRedirectServerResponse } from './redirect'
import { StreamServerResponse, isStreamServerResponse } from './stream'
import { TextServerResponse, isTextServerResponse } from './text'

export type ServerResponse =
  | JsonServerResponse
  | TextServerResponse
  | RedirectServerResponse
  | StreamServerResponse

export function isServerResponse(value: unknown): value is ServerResponse {
  return (
    isJsonServerResponse(value) ||
    isRedirectServerResponse(value) ||
    isStreamServerResponse(value) ||
    isTextServerResponse(value)
  )
}
