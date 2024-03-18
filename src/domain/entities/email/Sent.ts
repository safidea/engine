import type { Data as ToSendData } from './ToSend'

export interface Data extends ToSendData {
  id: string
}

export class Sent {
  constructor(public data: Data) {}

  findLink = (text: string) => {
    return this.data.html.match(new RegExp(`href="([^"]+)"[^>]*>${text}`))?.[1]
  }
}
