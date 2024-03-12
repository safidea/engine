export interface Data {
  id: string
  updated_at: Date
  [key: string]: string | number | boolean | Date | undefined
}

export class ToUpdate {
  constructor(public data: Data) {}
}
