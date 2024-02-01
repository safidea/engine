export interface PersistedData {
  id: string
  created_at: Date
  updated_at?: Date
  [key: string]: string | number | boolean | Date | undefined
}

export class Persisted {
  constructor(public data: PersistedData) {}
}
