import type { IdGenerator } from '@domain/services/IdGenerator'

export interface Data {
  id: string
  name: string
  file_data: Buffer
  created_at: Date
}

export interface Params {
  idGenerator: IdGenerator
}

export class ToSave {
  public data: Data

  constructor(data: Omit<Data, 'id' | 'created_at'>, params: Params) {
    const { idGenerator } = params
    this.data = {
      id: idGenerator.forFile(),
      created_at: new Date(),
      ...data,
    }
  }

  get id(): string {
    return this.data.id
  }
}
