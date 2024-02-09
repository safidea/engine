import type { Data as ToSendData } from './ToSend'

export interface Data extends ToSendData {
  id: string
}

export class Sent {
  constructor(public data: Data) {}
}
