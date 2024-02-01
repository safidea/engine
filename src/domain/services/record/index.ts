import { Persisted, type PersistedData } from './Persisted'
import { ToCreate, type ToCreateData, type ToCreateParams } from './ToCreate'

export type RecordParams = ToCreateParams

export class Record {
  constructor(private params: RecordParams) {}

  create(data: ToCreateData) {
    return new ToCreate(data, this.params)
  }

  persist(data: PersistedData) {
    return new Persisted(data)
  }
}
