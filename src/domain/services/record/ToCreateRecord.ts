import type { IdGenerator } from '@domain/services/IdGenerator'

export interface ToCreateRecordData {
  id: string
  created_at: Date
  [key: string]: string | number | boolean | Date | undefined
}

export interface ToCreateRecordParams {
  idGenerator: IdGenerator
}

export class ToCreateRecord {
  public data: ToCreateRecordData

  constructor(data: Partial<ToCreateRecordData>, params: ToCreateRecordParams) {
    this.data = {
      ...data,
      id: params.idGenerator.forRecord(),
      created_at: new Date(),
    }
  }
}
