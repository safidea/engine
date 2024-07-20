export interface Data {
  id: string
  updated_at: Date
  [key: string]: string | number | boolean | Date | undefined
}

export class ToUpdate {
  public data: Data

  constructor(data: Data) {
    this.data = {
      ...data,
      updated_at: new Date(),
    }
  }
}
