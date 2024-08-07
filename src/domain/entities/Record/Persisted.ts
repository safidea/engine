import type { DataType, Data as ToCreateData } from './ToCreate'

export interface Data extends ToCreateData {
  updated_at?: Date
}

export class Persisted {
  constructor(public data: Data) {}

  get id(): string {
    return this.data.id
  }

  getField = (key: string): DataType => {
    if (!(key in this.data)) throw new Error(`Field "${key}" not found in record`)
    return this.data[key]
  }

  getFieldAsString = (key: string): string => {
    return String(this.getField(key) ?? '')
  }
}
