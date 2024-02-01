import type { IdGenerator } from '@domain/services/IdGenerator'

export interface ToCreateData {
  id: string
  created_at: Date
  [key: string]: string | number | boolean | Date | undefined
}

export interface ToCreateParams {
  idGenerator: IdGenerator
}

export class ToCreate {
  public data: ToCreateData

  constructor(data: Partial<ToCreateData>, { idGenerator }: ToCreateParams) {
    this.data = {
      ...data,
      id: idGenerator.forRecord(),
      created_at: new Date(),
    }
  }
}
