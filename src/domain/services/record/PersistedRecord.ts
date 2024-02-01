export interface PersistedRecordData {
  id: string
  created_at: Date
  updated_at?: Date
  [key: string]: string | number | boolean | Date | undefined
}

export class PersistedRecord {
  constructor(public data: PersistedRecordData) {}
}
