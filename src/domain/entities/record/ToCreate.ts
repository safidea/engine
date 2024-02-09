import type { IdGenerator } from '@domain/services/IdGenerator'

export interface Data {
  id: string
  created_at: Date
  [key: string]: string | number | boolean | Date | undefined
}

export interface Params {
  idGenerator: IdGenerator
}

export class ToCreate {
  public data: Data

  constructor(data: Partial<Data>, { idGenerator }: Params) {
    this.data = {
      ...data,
      id: idGenerator.forRecord(),
      created_at: new Date(),
    }
  }
}
