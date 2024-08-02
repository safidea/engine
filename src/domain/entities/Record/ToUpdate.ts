export interface Data {
  id: string
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

  get id() {
    return this.data.id
  }
}
