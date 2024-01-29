import { BaseResponse } from './base'

export type MessageCallback = (message: string) => void

export class StreamServerResponse extends BaseResponse {
  private callback?: (event: string) => void

  constructor(statusCode?: number) {
    super(statusCode)
  }

  onEvent(callback: MessageCallback) {
    this.callback = callback
  }

  sendEvent(event: string) {
    if (this.callback) this.callback(event)
  }

  close() {}
}

export function isStreamServerResponse(value: unknown): value is StreamServerResponse {
  return value instanceof StreamServerResponse
}
