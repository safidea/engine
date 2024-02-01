import { JsonServerResponse, isJsonServerResponse } from './JsonServerResponse'
import { TextServerResponse, isTextServerResponse } from './TextServerResponse'

export type ServerResponse = JsonServerResponse | TextServerResponse

export function isServerResponse(value: unknown): value is ServerResponse {
  return isJsonServerResponse(value) || isTextServerResponse(value)
}
