import type { Data as ToCreateData } from './ToCreate'

export interface Data extends ToCreateData {
  updated_at?: Date
}

export class Persisted {
  constructor(public data: Data) {}
}
