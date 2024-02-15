import type { Data as ToCreateData } from './ToCreate'

export interface Data extends ToCreateData {
  updated_at?: Date
}

export class Persisted {
  constructor(public data: Data) {}

  getField(key: string): string | number | boolean | Date | undefined {
    if (!(key in this.data)) throw new Error(`Field "${key}" not found in record`)
    return this.data[key]
  }

  getFieldAsString(key: string): string {
    return String(this.getField(key) ?? '')
  }
}
